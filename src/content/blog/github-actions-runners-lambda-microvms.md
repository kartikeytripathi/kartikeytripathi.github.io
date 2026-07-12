---
title: "Every CI Job Gets Its Own Kernel: GitHub Actions Runners on AWS Lambda MicroVMs"
date: 2026-07-12
description: "Building single-use, Firecracker-isolated GitHub Actions runners on the new Lambda MicroVMs primitive — architecture, full repro, and the snapshot-identity problem nobody talks about."
tags:
  - aws
  - lambda
  - firecracker
  - github-actions
  - ci-cd
  - containers
  - microvms
author: Kartikey Tripathi
---

![GitHub Actions runners on AWS Lambda MicroVMs](/images/blog/hero-banner-microvm.png)

Most CI isolation stories end at the container boundary: a namespace, a cgroup, a shared kernel, and a prayer. On June 22, 2026, AWS quietly shipped something that moves that boundary a whole layer down — **Lambda MicroVMs**, a serverless primitive that hands you a Firecracker virtual machine with its own kernel, an 8-hour lifetime, and snapshot-based boot in seconds.

The moment I read the launch post, one use case jumped out: **ephemeral GitHub Actions runners**. One job, one VM, one kernel — then everything disappears. No runner fleet to patch, no autoscaling group to babysit, no leftover state for the next job to inherit.

This post walks through how I built it, end to end: the architecture, the full repro, the deliberate breakage (of course), and the one design constraint that quietly shapes the entire system — what I call the **snapshot-identity problem**.

> **TL;DR** — It works, and it works well. Queue-to-execution in tens of seconds, hardware isolation per job, pre-warmed toolchains baked into the snapshot, and pricing (~$0.0044/min for 2 vCPU / 4 GB arm64) that lands almost exactly on GitHub's own hosted arm runners — except billed per second, running in *your* account, in *your* region, with *your* VPC access.

---

## What a Lambda MicroVM actually is

If you've read my container fundamentals series, you know the chain for a pod: `kubelet → containerd → runc → clone() with namespace flags`. The process you get shares a kernel with everything else on the node. Strong-ish, but one kernel bug away from a bad day.

A Lambda MicroVM sits on a different chain entirely: `run-microvm → Firecracker → KVM → guest kernel boot (from snapshot)`. This is the same Firecracker VMM that has been under Lambda functions all along — AWS says it powers 15+ trillion invocations a month — but for the first time you get to hold the VM itself, not a 15-minute function wrapped around it.

The lifecycle model:

| Step | What happens |
|---|---|
| Package | Zip your app + a `Dockerfile`, upload to S3 |
| Build | `create-microvm-image` — Lambda runs your Dockerfile on a managed AL2023 base, **starts your app**, then snapshots the *running* state (memory + disk) |
| Launch | `run-microvm` — restores a VM from the snapshot in seconds |
| Connect | Each VM gets a dedicated HTTPS endpoint, authenticated with a short-lived JWE token in the `X-aws-proxy-auth` header |
| End | `terminate-microvm` — or an 8-hour ceiling, whichever comes first |

The properties that matter for CI:

| Property | Value | Why it matters for runners |
|---|---|---|
| Isolation | Hardware VM, own kernel | Untrusted PR code can't touch anything else |
| Max lifetime | 8 hours | Covers essentially every real CI job |
| Architecture | **arm64 only** (Graviton 3/4) | Your workflows must target arm64 |
| OS | Full OS — packages, daemons, mounts | `dockerd` runs *inside* the VM. Yes, containers inside the microVM |
| Pre-warming | Anything in the Dockerfile lands in the snapshot | Toolchains, apt packages, even pulled Docker images boot pre-loaded |
| Regions at launch | us-east-1, us-east-2, us-west-2, eu-west-1, ap-northeast-1 | ap-south-1 users (👋 hello from India): pick us-east-1 for now |
| Cost (2 vCPU / 4 GB) | ~$0.0044/min, per-second billing | GitHub's `linux_2_core_arm` is $0.005/min, per-minute billing |

That "snapshots the *running* state" detail in the build step looks like a footnote. It is not. It is the whole plot.

---

## The snapshot-identity problem

Here is the trap that makes this project interesting.

A naive design says: put the GitHub Actions runner in the Dockerfile, register it during the image build, snapshot it, and launch registered runners on demand. Beautiful. Zero startup work.

Except the snapshot captures a **fully-initialized running process** — and every MicroVM launched from that image is a *byte-identical clone* of that moment. If the runner registered during the build, every VM wakes up believing it is the **same runner**: same name, same credentials, same identity. GitHub registration tokens are single-use; runner names must be unique. Your second VM either conflicts with the first or hijacks its identity. The AWS docs even warn about this class of bug for cryptographic material — anything unique generated at build time is shared across every VM forever.

This is the exact same problem the Firecracker snapshot papers describe for cloned VMs and RNG state, just wearing a CI costume.

**The fix defines the architecture:** the snapshotted process must not be the runner. It must be a tiny **bootstrap agent** — a ~40-line HTTP server that sits on port 8080 doing nothing. Identity gets injected *after* boot, per VM, with a fresh single-use registration token pushed in through the VM's authenticated HTTPS endpoint. The runner binary is pre-baked into the snapshot (saving 30–60 s of download per job), but it stays **unconfigured** until a specific job claims the VM.

Once you internalize that, everything else is plumbing.

---

## Architecture

![End-to-end architecture: webhook → SQS → launcher → MicroVM → janitor](/images/blog/hero-microvm-runners.svg)

```
GitHub repo
   │  workflow_job webhook (queued / completed)
   ▼
API Gateway (HTTP API)
   │  HMAC verify (X-Hub-Signature-256) ← the ONLY gate against forged launches
   ▼
SQS jobs queue                    SQS cleanup queue
   │                                    ▲
   ▼                                    │
Launcher Lambda ─────────────────► Janitor Lambda
   │ 1. run-microvm (snapshot boot)     │ terminate-microvm on job completion
   │ 2. mint single-use reg token       │ + 10-min orphan sweep (lost webhooks)
   │ 3. POST {token, name, labels}      │
   │    into the VM over HTTPS          │
   ▼                                    │
Lambda MicroVM (one per job) ───────────┘
   ├─ bootstrap agent (snapshotted, :8080)
   ├─ ./config.sh --ephemeral ... && ./run.sh
   ├─ runs exactly ONE job
   └─ gone
```

Three deliberate choices worth defending:

**`--ephemeral` mode.** The runner deregisters itself after exactly one job — GitHub's blessed pattern for single-use runners. No idle runner ever waits around collecting jobs it shouldn't.

**runner name = microvmId.** When the `completed` webhook arrives, the janitor reads `workflow_job.runner_name`, sees `mvm-0123...`, and knows exactly which VM to terminate. No lookup table, no tags, no state.

**Push, not poll.** The launcher pushes job config *into* the VM through its endpoint instead of the VM polling SQS. This keeps credentials out of the image entirely and uses the only ingress path MicroVMs give you anyway — HTTPS with a JWE token. There is no way to make the endpoint public, and for a CI runner that's a feature.

---

## The build, condensed

The full lab guide (with a hello-world Phase 1 and every CLI command) is linked at the bottom; here are the load-bearing pieces.

### The bootstrap agent

```python
# bootstrap.py — snapshotted running; waits for ONE job, becomes a runner
def start_runner(cfg):
    subprocess.run([
        f"{RUNNER_DIR}/config.sh",
        "--url", cfg["repo_url"],
        "--token", cfg["reg_token"],     # single-use, minted per VM
        "--name", cfg["runner_name"],    # = microvmId, guaranteed unique
        "--labels", cfg.get("labels", "microvm,arm64"),
        "--ephemeral",                   # one job, then self-deregister
        "--unattended", "--disableupdate",
    ], cwd=RUNNER_DIR, check=True, env=RUNNER_ENV)
    subprocess.run([f"{RUNNER_DIR}/run.sh"], cwd=RUNNER_DIR, env=RUNNER_ENV)
```

### The Dockerfile

```dockerfile
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y \
    curl jq git python3 ca-certificates \
    libicu74 libssl3 libkrb5-3 zlib1g \
    docker.io && rm -rf /var/lib/apt/lists/*

# Pre-bake the arm64 runner INTO the snapshot — but never configure it here
ARG RUNNER_VERSION=2.325.0
RUN mkdir -p /opt/runner && cd /opt/runner && \
    curl -fsSL -o r.tgz https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-arm64-${RUNNER_VERSION}.tar.gz && \
    tar xzf r.tgz && rm r.tgz

COPY bootstrap.py /opt/bootstrap.py
EXPOSE 8080
CMD ["python3", "/opt/bootstrap.py"]
```

Two traps hiding in plain sight: the actions runner is a .NET application, so **Alpine/musl will not work** — you need glibc and ICU, hence Ubuntu. And everything must be **aarch64** — there is no x86_64 option, full stop.

### The workflow

```yaml
jobs:
  smoke:
    runs-on: [self-hosted, microvm, arm64]
    steps:
      - uses: actions/checkout@v4
      - run: |
          uname -m                      # aarch64
          grep -i impl /proc/cpuinfo    # Graviton says hello
      - run: |
          sudo service docker start
          docker run --rm alpine echo "a container inside a microVM ✓"
```

That last step still makes me smile. A container, inside a Firecracker VM, launched by a webhook, billed by the second.

### One template to deploy it all

The whole thing — MicroVM image, webhook API with HMAC verification, both queues, launcher, janitor, orphan-sweep schedule, DLQ alarm — fits in a single CloudFormation template, because MicroVM images shipped with day-one CFN support:

```yaml
RunnerMicrovmImage:
  Type: AWS::Lambda::MicrovmImage
  Properties:
    Name: !Sub ${AWS::StackName}-gha-runner
    BaseImageArn: !Sub arn:aws:lambda:${AWS::Region}:aws:microvm-image:al2023-1
    BaseImageVersion: !Ref BaseImageVersion
    BuildRoleArn: !GetAtt MicrovmBuildRole.Arn
    CodeArtifact:
      Uri: !Sub s3://${ArtifactBucket}/runner/runner.zip
    AdditionalOsCapabilities: [ALL]        # dockerd needs this
    CpuConfigurations:
      - Architecture: ARM_64
        Resources:
          - MinimumMemoryInMiB: 4096
```

Note the split: the **image** is a CloudFormation resource; the **running VMs** deliberately are not. VMs are dynamic runtime resources — the launcher owns the fleet, the stack owns the snapshot. Fighting that split (custom resources spawning VMs from CFN) is a mistake I'd encourage you not to discover personally.

---

## Break it on purpose

You don't understand a system until you've watched it fail in every way it's designed to fail. My favorites from this build:

| Break it | Symptom | Lesson |
|---|---|---|
| Register the runner inside the Dockerfile | First VM works; second VM conflicts or hijacks the first's identity | The snapshot-identity problem, experienced firsthand. Identity is a *runtime* concern |
| Reuse a registration token for a second VM | `NotFound` from GitHub | Tokens are single-use and expire in ~1 h. One token, one VM, always |
| Write IAM policy with `lambda-microvms:RunMicrovm` | `AccessDenied` with a "correct-looking" policy | The signing name is `lambda` → actions are `lambda:RunMicrovm`. The service name in the CLI and the IAM namespace **do not match** |
| Skip webhook HMAC verification | Anyone with your endpoint URL can launch VMs into your bill | The signature check is not optional. Demo it with a forged `curl` |
| Use `node:24-alpine` as the base | `config.sh` dies with .NET/ICU errors | glibc or bust |
| Kill the janitor, run three jobs | VMs pile up in `RUNNING`, billing continues | The 8-hour ceiling is your only backstop. `list-microvms` is your audit command — alias it |
| Deploy the Lambda without bundling boto3 | `UnknownServiceError: lambda-microvms` | The runtime's boto3 doesn't carry the new service model yet. Bundle your own; verify locally before deploying |

That IAM namespace mismatch cost me the most time, and I diagnose IAM problems for a living. Consider yourself warned.

---

## Numbers

| Stage | Time |
|---|---|
| Webhook → launcher invoked | < 1 s |
| `run-microvm` → `RUNNING` (snapshot restore) | ~X s |
| Registration + job pickup | ~X s |
| **Total queue-to-execution** | **~X s** (vs ~2 min for the EC2-runner pattern) |

And the honest cost picture:

| Option | Rate | Trade-off |
|---|---|---|
| GitHub hosted `linux_2_core_arm` | $0.005/min, per-minute | Zero ops, US-hosted, shared model |
| **Lambda MicroVM runner** | ~$0.0044/min, per-second (+ ~$1.5/mo snapshot storage/IO at small scale) | Your account, your region, VM isolation, pre-warming — but you own the infra |
| EC2 ephemeral runner | Instance rate | 30–120 s boots; AMIs, orphan cleanup, scaling logic all yours |
| CodeBuild GH runners | Per build-minute | Managed, but slow cold starts and it isn't a true VM |

The cost is a wash against hosted runners. You don't do this to save money. You do it for **isolation** (untrusted PR code), **latency** (runners in the same region as the systems your E2E tests hammer — community reports show multi-minute savings on chatty test suites), and **pre-warming** (a snapshot with your entire toolchain already loaded is a superpower hosted runners will never give you).

## When you shouldn't

Equal honesty: skip this if your builds need x86_64 (arm64 only, no exceptions), if a job runs past 8 hours, if your region isn't supported yet and cross-region latency defeats the purpose, or if nobody on the team wants to own runner infrastructure — patching, quotas, incident response, all of it. Also: default MicroVM quotas are *low* and increase requests are slow and inconsistent. File yours on day one.

---

## The internals thread

I'll leave you with the part I find genuinely beautiful. When your workflow's job goes green, this is the actual chain that executed it:

```
GitHub webhook → API Gateway → SQS → Lambda function (a Firecracker microVM)
  → run-microvm → Firecracker restores a memory+disk snapshot
    → guest AL2023 kernel resumes mid-heartbeat
      → bootstrap agent receives one HTTPS POST
        → actions runner registers, pulls one job
          → dockerd (inside the VM) → containerd → runc
            → clone() with namespace flags → your build
```

Namespaces inside a VM inside a serverless control plane — the entire container fundamentals stack, plus one more turtle underneath. The isolation boundary you actually get is no longer a shared kernel's syscall filter; it's KVM.

Every CI job gets its own kernel. We live in the future, and it bills per second.

---

*References: [AWS Lambda MicroVMs developer guide](https://docs.aws.amazon.com/lambda/latest/dg/lambda-microvms-guide.html) · [Launch announcement](https://aws.amazon.com/about-aws/whats-new/2026/06/aws-lambda-microvms/) · Luc van Donkersgoed's [GitHub Runner Orchestrator](https://github.com/donkersgoed/github-runner-ochestrator) (CDK) · [machulav/ec2-github-runner](https://github.com/machulav/ec2-github-runner) (the prior art that inspired this) · [philips-labs/terraform-aws-github-runner](https://philips-labs.github.io/terraform-aws-github-runner/) (scale patterns)*

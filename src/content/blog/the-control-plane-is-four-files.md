---
title: "The Control Plane Is Four Files"
date: 2026-08-30
description: "I'd never once looked inside /etc/kubernetes before this weekend. Here's what happened when I finally built a kubeadm cluster from scratch — static pods, mirror pods, etcd internals, and the two times I destroyed my own cluster."
tags:
  - kubernetes
  - kubeadm
  - cka
  - etcd
  - static-pods
  - control-plane
  - debugging
author: Kartikey Tripathi
---

*CKA prep · day one — ~11 min read*

I had never once looked inside `/etc/kubernetes`.

That's not laziness. On EKS, AWS runs the control plane in an account you can't SSH into. There's no etcd to back up because AWS does it. No cluster to upgrade by hand because upgrading is an API call. No API server to watch fail to start, because if it does, that's someone else's pager.

Which is fine, right up until you sit the CKA — where **25% of the exam is exactly the part managed Kubernetes lets you ignore.**

So this weekend I built a two-node kubeadm cluster on EC2 and spent a day breaking it. This is what I found. I've written it for the version of me from a week ago: comfortable operating Kubernetes, completely unfamiliar with its plumbing.

---

## The question I'd never thought to ask

Here's a thing that should have bothered me years ago and didn't.

The control plane runs as pods. The API server, the scheduler, the controller manager, etcd — all pods. But pods get created by the API server and placed by the scheduler.

So how does the *first* one start? What creates the pod that creates pods?

I'd never asked. It worked, so I never looked. The answer turns out to be the single most useful thing I learned all day, and everything else in this post falls out of it.

### The kubelet isn't a Kubernetes thing

The kubelet is a plain systemd daemon. `systemctl status kubelet`. It starts when the machine boots, with no cluster, no API server, nothing.

And it takes work from **two** places:

- The API server — normal pods, scheduled to this node.
- **A directory on local disk.** Anything you drop there, it runs.

That directory is `/etc/kubernetes/manifests`. No API server involved. No scheduler. No etcd. The kubelet just reads files and starts containers.

So when I ran `kubeadm init`, it didn't "deploy" a control plane. It wrote four YAML files into a folder that a daemon was already watching:

```
$ ls /etc/kubernetes/manifests/
etcd.yaml
kube-apiserver.yaml
kube-controller-manager.yaml
kube-scheduler.yaml
```

That's it. That's the control plane. Four files.

> I'd spent years treating the control plane as a service. It's a directory.

### I tested it, because I didn't believe it

If the kubelet runs anything in that folder, then it should run something that obviously isn't a control-plane component. So I dropped a plain nginx pod manifest in there.

```
$ kubectl get pods
NAME                                  READY   STATUS    AGE
static-nginx-test-cka-control-plane   1/1     Running   17s
```

Running. I never applied it. I never talked to the API server. I copied a file into a folder.

Notice the name, though — I called it `static-nginx-test`, and it came back as `static-nginx-test-cka-control-plane`. The kubelet appended the node name. Once you've seen that, you can spot a static pod anywhere: `kube-apiserver-cka-control-plane`, `etcd-cka-control-plane`. That suffix is the tell.

*11:20 · the first genuinely surprising thing*

## You can see static pods. You can't delete them.

Here's the wrinkle. If the kubelet starts these pods from disk without telling anyone, how does `kubectl get pods` know they exist?

It doesn't, really. The kubelet publishes a **mirror pod** — a read-only stand-in object pushed up to the API purely so the pod shows up. It's a reflection. The file on disk is the actual thing.

Which means this happens:

```
$ kubectl delete pod -n kube-system kube-scheduler-cka-control-plane
pod "kube-scheduler-cka-control-plane" deleted

$ kubectl get pods -n kube-system | grep scheduler
kube-scheduler-cka-control-plane   1/1   Running   0   2s
```

It reports success and the pod is instantly back. I assumed it had been killed and restarted very fast. It hadn't — and the proof is in a column I'd never paid attention to:

| Pod | Age | Restarts |
|---|---|---|
| kube-apiserver | 16h | 1 (64m ago) |
| **kube-scheduler** | **41m** | **1 (64m ago)** |

I'd deleted the scheduler 41 minutes earlier, so the API *object* is 41 minutes old — brand new. But its container last restarted 64 minutes ago, same as everything else on the node.

The container never stopped. Not for a moment. I deleted the reflection; the kubelet published a new one; the actual scheduler process carried on without noticing.

> **Note:** If `kubectl delete` can't stop a static pod, what does? You move the file. `mv /etc/kubernetes/manifests/kube-scheduler.yaml /tmp/` and it's gone until you move it back. That's not a workaround — it's the actual control mechanism, and it becomes important later.

## What etcd actually is

Every component in Kubernetes is stateless except one.

The API server holds nothing. It authenticates you, authorizes you, validates your object — then reads and writes etcd. The scheduler holds nothing. The controller manager holds nothing. Kill any of them and you lose the ability to *change* things, not the things themselves.

etcd is the whole cluster. Which gives you a sentence worth memorising: **backing up the cluster means backing up etcd.** Not your YAML files. Not your Deployments. One key-value store on one node.

You can just look at it, which I'd never realised:

```
$ etcdctl --endpoints=https://127.0.0.1:2379 \
    --cacert=/etc/kubernetes/pki/etcd/ca.crt \
    --cert=/etc/kubernetes/pki/etcd/server.crt \
    --key=/etc/kubernetes/pki/etcd/server.key \
    get /registry --prefix --keys-only | head

/registry/apiextensions.k8s.io/customresourcedefinitions/bgppeers.crd.projectcalico.org
/registry/clusterrolebindings/cluster-admin
/registry/pods/kube-system/etcd-cka-control-plane
...
```

It's flat. `/registry/<resource>/<namespace>/<name>`. Namespaces, ownership, label selectors — all of that is interpretation the API server layers on top of a plain keyspace.

### The demo that changed how I think about Secrets

I made a Secret the normal way, then read it out of etcd directly:

```
$ kubectl create secret generic demo --from-literal=password=hunter2

$ etcdctl ... get /registry/secrets/default/demo
/registry/secrets/default/demo
k8s
v1Secret
demo default
password hunter2 Opaque
```

`hunter2`. Sitting there in plaintext. No RBAC check happened. Nothing was audited. Nothing asked who I was beyond "do you hold an etcd client certificate."

That's why etcd has **its own certificate authority**, separate from the cluster CA — I'd wondered why there were two. Every security control Kubernetes has lives in the API server. Reach etcd directly and you've walked around all of them. Only one component gets an etcd-signed client cert: the API server itself.

It also means Secrets aren't encrypted at rest by default on a kubeadm cluster. They're base64-encoded, which is not encryption, it's just an inconvenience.

*14:30 · two binaries, one lesson*

## etcdctl and etcdutl, and why the split matters

I hit this immediately and it confused me for a while, so: as of etcd 3.5 the tooling is split in two, and in 3.6 `etcdctl snapshot restore` is **gone entirely**.

| Tool | Works on | Needs certs? |
|---|---|---|
| `etcdctl` | a running etcd, over the network | **Yes** |
| `etcdutl` | local files and directories | **No** |

I'd been wondering why every guide passes three certificate flags to the backup and none to the restore. It looked like an inconsistency. It isn't:

**Backup talks to a live server**, so it's a TLS client and needs to prove who it is. **Restore reads a file and writes a directory.** It never touches the network. There's nothing to authenticate to.

The clearest proof is in the help output. `etcdutl` doesn't have a `--cacert` flag you can omit — the flag doesn't exist. There's nowhere to put a certificate.

> **Note:** Practical tip: etcd versions vary between clusters. First move on any etcd task is `etcdctl snapshot --help`. If `restore` isn't listed, it's on `etcdutl`. Five seconds, and it beats debugging a missing subcommand.

### And restore doesn't do what I assumed

I thought restore meant "load this snapshot into etcd." It doesn't. It builds a **brand new data directory, offline**, with a new cluster ID — deliberately, so a restored snapshot can never silently rejoin a live cluster and corrupt consensus.

So restoring is two moves, not one:

- `etcdutl snapshot restore snap.db --data-dir=/var/lib/etcd-new` — builds the directory.
- Edit `etcd.yaml` so the `hostPath` volume points at it — makes it live.

And then you wait, because you don't restart anything. The kubelet notices the file changed and does it for you. Same mechanism as everything else in this post.

*15:51 · the first cluster I destroyed*

## How `DirectoryOrCreate` ate my cluster

Cleaning up between practice runs, I deleted the restore directory:

```
$ sudo rm -rf /var/lib/etcd-restore
```

What I forgot was that the manifest still pointed at it. And the volume is declared like this:

```yaml
  - hostPath:
      path: /var/lib/etcd-restore
      type: DirectoryOrCreate   # <-- this
```

`DirectoryOrCreate` means the kubelet creates the directory if it's missing. So I deleted it, the kubelet immediately made a new empty one, and etcd started up against a blank datastore.

> **What made this nasty:** Nothing crashed. There was no error anywhere. etcd came up perfectly healthy, the API server connected happily, and `kubectl` answered every query — about a cluster that contained nothing.
>
> **An empty etcd doesn't fail loudly. It fails as a working, empty cluster.**

My first clue was a number. A snapshot I took while confused read `266 keys, revision 1203`. The healthy one from an hour earlier read `359 keys, revision 17768`. That's the tell — and it's why `etcdutl snapshot status` before you trust a snapshot is a two-second habit worth having.

Then I got locked out of my own cluster:

```
Error from server (Forbidden): deployments.apps is forbidden:
User "kubernetes-admin" cannot list resource "deployments"
```

Read that carefully, because the wording is the diagnosis. It knows I'm `kubernetes-admin`. Authentication worked perfectly. **Authorization** is what failed — my certificate proved who I was and then permitted me nothing.

Why? On kubeadm 1.29+, `admin.conf` carries the group `kubeadm:cluster-admins`, and there's a ClusterRoleBinding granting that group admin rights. That binding is created by *kubeadm*, not by the API server's built-in bootstrap. So a blank etcd gets Kubernetes' default RBAC — but not kubeadm's. My cert was valid. The thing that gave it meaning had ceased to exist.

> **The recovery:** My real data was never touched. It was still sitting in `/var/lib/etcd`, 17MB, exactly as I'd left it. Pointing the manifest back at it was a one-line edit. **Restoring to a new directory instead of overwriting the old one is what made this a scare rather than a disaster.**

*16:16 · the second one, which taught me more*

## The cluster was fine. The API server was lying.

I fixed the manifest. etcd came back with all my data. And I was still locked out.

The kubelet log had the better error:

```
User "system:node:cka-control-plane" cannot get resource "pods"
"no relationship found between node 'cka-control-plane' and this object"
```

The kubelet was being told it had no relationship to a pod that was demonstrably running on it.

Here's what I'd missed. **The API server never restarted when etcd did.** It had been running since the blank-cluster period, holding a cache and an authorization graph built from a cluster that no longer existed, while etcd underneath now held completely different data about 16,500 revisions further along.

etcd was correct. The API server was answering from memory.

> etcd holds the state. The API server holds a *view* of it. Change the state underneath a running API server and the view goes stale — confidently, and without any error at all.

The fix uses the mechanism from the top of this post — move the manifests out, wait, move them back:

```
$ sudo mv /etc/kubernetes/manifests/*.yaml /tmp/cp-bounce/
$ sudo crictl ps          # wait until empty
$ sudo mv /tmp/cp-bounce/*.yaml /etc/kubernetes/manifests/
```

Everything came back. **This step is not in the official docs**, and it's the one that makes a perfectly correct restore look like a failure.

### Two smaller things that cost me time

**Restores take minutes, not seconds.** I ran `crictl ps | grep etcd` five times, got nothing, and assumed it had failed. The kubelet log explained it: it was stuck retrying `Failed deleting a mirror pod` against an API server that was waiting for the etcd I was restarting. It needs the API server to clean up the record of the thing whose absence is breaking the API server. It resolves itself in two to four minutes.

**When `kubectl` is dead, use `crictl`.** Obvious in hindsight. `kubectl` is a REST client — when the API server is down it has nobody to talk to. `crictl` asks containerd directly and doesn't care whether Kubernetes exists.

## The evidence I now trust

One last thing, because it's the check I'll use on exam day. After restoring, my deployment came back like this:

```
NAME    READY   UP-TO-DATE   AVAILABLE   AGE
john    0/1     1            0           23m
```

**23 minutes old.** Not 10 seconds. `AGE` comes from `creationTimestamp`, which lives inside the object in etcd — so a restored object comes back *old*. A recreated one would be seconds new.

That single column is how you tell an actual rollback from something that merely looks like one.

(It was `0/1` because a restore rolls back the desired state, not reality on the nodes. The container had been destroyed; deleting the stale pod let the ReplicaSet build a real one. Worth knowing that restoring etcd doesn't restore running processes — it restores the record of what *should* be running.)

---

## If you're starting this from where I did

Four things I'd tell myself on Friday.

**Build the cluster by hand, and don't automate it.** I used Terraform for the EC2 instances and stopped there — `kubeadm init` and `join` I run myself, every time. Watching the phases scroll past is genuinely how the PKI, the static pods and the bootstrap tokens stopped being abstract.

**Break it on purpose, early, with a snapshot in hand.** I took an AMI while the cluster was healthy and never needed it — but knowing it existed is why I was willing to run `rm -rf` in a directory I only half understood.

**Read errors as evidence, not noise.** "Cannot list deployments" and "no relationship found between node and object" both told me precisely what was wrong, once I understood that authentication and authorization are separate systems. I spent twenty minutes assuming my cluster was corrupt before I actually read the words.

**Watch the numbers.** Key counts. Revisions. AGE columns. Restart counters. Every failure I hit today was visible in a number before it was visible in an error — and in one case, there was never going to be an error at all.

Four reps, two self-inflicted outages, no rebuilds. That's a better day one than a clean run would have been, because I now know what these failures look like from the inside — which is the part that transfers when the clock is running.

---

*Part of a five-week CKA sprint. Lab: two `t3.medium` EC2 instances, Ubuntu 24.04, kubeadm 1.34.11, Calico — deliberately not EKS, because EKS cannot teach the thing this exam tests hardest.*

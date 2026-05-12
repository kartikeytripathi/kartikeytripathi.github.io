# The Manifest List Trap: Why Your ECR Lifecycle Policy Keeps Failing

*One push creates three things in your registry. Your "delete untagged images older than 7 days" rule sees only two of them — and that's where the trouble starts.*

---

You set up a sensible ECR lifecycle policy. Something like: *keep the 10 most recent tagged images, delete untagged images older than 7 days*. For weeks, it works. Then one morning you check the policy evaluation results and find a stream of failures with a cryptic code:

```json
"lifecycleEventFailureDetails": [
  {
    "lifecycleEventImage": {
      "digest": "sha256:d2bce1a58adcbf52953ebbf0c6db8d1e1df48ac04bb8439407fbc50eeafe87d4",
      "tagStatus": "Untagged",
      "tagList": [],
      "pushedAt": 1746202309561
    },
    "rulePriority": 1,
    "failureCode": "ImageReferencedByManifestList",
    "failureReason": "Requested image referenced by manifest list: [sha256:524b569833fa9753c385fc062375b4c65f0d6d677fb962c09e39c653883ee695]"
  }
]
```

Untagged. Over 7 days old. Should be safe to delete. ECR says no. And the AWS console doesn't really help you understand why — it just shows you a list of "Untagged" entries that look identical to genuinely orphaned blobs you'd want to clean up.

The short answer: you're running multi-arch builds, and ECR is protecting you from yourself. The long answer is worth understanding, because the same misunderstanding causes silent storage bloat, mis-scoped policies, and the dreaded "but the console says it's not in use" outage.

Let's walk through the object model, the trap, and what to do about it.

---

## What a "multi-arch image" actually is

When you run something like this with buildx:

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapp:v1 \
  --push .
```

You are not pushing one image. You are pushing several distinct objects to the registry, arranged in a tree. The tree looks like this:

```
:v1  (tag)
 │
 ▼
manifest list (a.k.a. OCI image index)
 ├── image manifest  →  config blob  +  layer blobs        [linux/amd64]
 └── image manifest  →  config blob  +  layer blobs        [linux/arm64]
```

Concretely:

| Object | Content type | What it is |
|---|---|---|
| **Manifest list** | `application/vnd.docker.distribution.manifest.list.v2+json` *(or OCI image index)* | A small JSON file that says: "for amd64, fetch this digest; for arm64, fetch that digest." |
| **Image manifest** | `application/vnd.docker.distribution.manifest.v2+json` *(or OCI image manifest)* | One per platform. Points to a config blob and the ordered list of layer blobs. |
| **Config blob** | A JSON document with env vars, entrypoint, working dir, etc. |
| **Layer blob** | A gzipped tarball of filesystem deltas. |

The **tag** (`:v1`) points to the manifest list. The platform-specific image manifests don't get tagged — they exist only as digest-addressed references from the manifest list. When `docker pull` runs on an arm64 machine, the client fetches the manifest list, sees the arm64 entry, fetches *that* manifest by digest, then fetches the config and layers it points to.

This is how `docker pull myapp:v1` on a Mac and on an EKS arm64 node "just work."

It's also where the lifecycle trap lives.

---

## How ECR sees your push

ECR is a registry that exposes a fairly traditional view of these objects: each manifest is an "image" with a digest, an optional set of tags, and a push timestamp. When your buildx push lands, ECR records:

| Digest | Tag | Push time | Notes |
|---|---|---|---|
| `sha256:524b56…` | `v1` | t | The **manifest list** |
| `sha256:d2bce1…` | *(none)* | t | The **amd64 image manifest** |
| `sha256:9f0a72…` | *(none)* | t | The **arm64 image manifest** |

In the ECR console, these appear as **three rows** in your repository — one tagged `v1` and two with `<untagged>` next to them. The console doesn't visualize the parent-child relationship; you have to know it's there. This is [a long-standing complaint](https://github.com/aws/containers-roadmap/issues/1596) — to a casual user, it looks like every push leaks two stray untagged blobs.

Now, look at this list with the eyes of a lifecycle policy.

---

## How the lifecycle policy evaluator works

A lifecycle policy is a small JSON document with one or more rules. Each rule has:

- A **priority** (lower = evaluated first).
- A **selection** — either `tagStatus: tagged` (with a `tagPatternList` or `tagPrefixList`) or `tagStatus: untagged` or `tagStatus: any`.
- A **count condition** — "older than N days" or "more than N images."
- An **action** — currently always `expire`.

The evaluator runs every rule against every image, marks which images each rule would affect, then applies rules in priority order. Each image is expired by **exactly one or zero** rules — once a rule claims an image, no other rule re-claims it.

Now consider the canonical policy people write:

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Delete untagged images older than 7 days",
      "selection": { "tagStatus": "untagged", "countType": "sinceImagePushed", "countUnit": "days", "countNumber": 7 },
      "action": { "type": "expire" }
    },
    {
      "rulePriority": 2,
      "description": "Keep last 10 tagged builds",
      "selection": { "tagStatus": "tagged", "tagPrefixList": ["v"], "countType": "imageCountMoreThan", "countNumber": 10 },
      "action": { "type": "expire" }
    }
  ]
}
```

This reads sensibly in English. In practice, on a multi-arch repo, it does this:

1. **Rule 1** sees every platform-specific manifest as an untagged image and tries to delete the ones older than 7 days.
2. **Rule 2** sees the manifest lists as tagged images and tries to keep the ten most recent.

But rule 1 runs first. And the manifest list for `v1` is still tagged — it's well within the "keep 10" window. So when ECR tries to delete the amd64 and arm64 children of an actively-tagged manifest list, it hits the referential integrity check and fails with `ImageReferencedByManifestList`.

You don't see this in the console; you see it in `DescribeImageReplicationStatus` / lifecycle policy events / CloudTrail.

---

## What ECR *does* try to do for you

AWS has been chipping away at this. The current documented behavior is:

> *When reference artifacts are present in a repository, Amazon ECR lifecycle policies automatically expire or archive those artifacts within 24 hours of the deletion or archival of the subject image.*

In plain English: when the manifest list **is** about to be deleted by a lifecycle rule, ECR will then auto-clean its child manifests within 24 hours. "Reference artifacts" here also covers image signatures (Cosign attestations, etc.) — same parent-child shape, same protection.

The race only happens in the other direction: when a rule targets the **child** while the **parent** is still alive. That's the case where `ImageReferencedByManifestList` fires.

So the fix is to not write rules that target the children of still-living manifest lists.

---

## What actually works

There are a few patterns. None of them are magic, and which one you pick depends on your CI conventions.

### Pattern 1: Don't use `untagged` for cleanup at all

Move all aging logic to tag-based rules. Every build gets a tag (commit SHA, semver, env+timestamp), and your rule retires by tag age:

```json
{
  "rulePriority": 1,
  "selection": {
    "tagStatus": "tagged",
    "tagPatternList": ["v*"],
    "countType": "sinceImagePushed",
    "countUnit": "days",
    "countNumber": 30
  },
  "action": { "type": "expire" }
}
```

When the manifest list expires, ECR will sweep the orphaned platform manifests within 24 hours, for free.

This is my default recommendation. It also dovetails with making tags immutable in production, which you should be doing anyway.

### Pattern 2: Use a long `untagged` window

If you must keep an "untagged" rule (for failed pushes, half-broken manifests, abandoned signatures), make the age threshold generous — at least a day or two longer than the longest-lived tag you keep. That gives ECR's own cleanup pass time to drop the manifest list first, so the child manifests are *genuinely* orphaned by the time your rule wakes up.

```json
{
  "rulePriority": 2,
  "selection": {
    "tagStatus": "untagged",
    "countType": "sinceImagePushed",
    "countUnit": "days",
    "countNumber": 14
  },
  "action": { "type": "expire" }
}
```

A 7-day untagged rule combined with a 30-day tag retention rule is the most common version of the trap. They look harmless side by side.

### Pattern 3: Pre-resolve via Lambda

For repos with custom retention logic — or where you need to coordinate cross-account consumers — a small Lambda that runs before lifecycle evaluation can walk manifest lists, resolve their children, and mark the safe ones with a tag that your lifecycle rule can target precisely. This is heavier than it sounds, and I'd only reach for it if patterns 1 and 2 can't model your policy.

---

## Bonus trap: the `tagPatternList` AND

While we're here, a related gotcha that bites multi-arch users specifically:

When you specify multiple patterns in `tagPatternList`, ECR treats them as **AND**, not OR. So this rule:

```json
"tagPatternList": ["*.temp", "*.temp-*"]
```

…matches nothing. No single image has both `*.temp` and `*.temp-*` simultaneously. If you're using a tagging scheme like:

| Tag | What it points to |
|---|---|
| `feature-abc.temp` | The manifest list |
| `feature-abc.temp-amd64` | The amd64 image manifest |
| `feature-abc.temp-arm64` | The arm64 image manifest |

…you need **two separate rules**, one per pattern. The policy editor will not warn you that your rule matches zero images.

---

## The console gap, and why it matters in support

Two related console limitations are worth knowing about because they cause real outages:

| Gap | What you see | What's actually happening |
|---|---|---|
| **Multi-arch as three images** | One repository row per manifest — manifest list plus N untagged children | One logical image, N+1 registry objects |
| **Cross-account "not in use"** | A cross-account ECS task pulls your image; ECR console still shows it as not referenced | ECR's "image in use" indicator scopes to the current account only |

The second one is particularly dangerous: you confidently delete an "unused" image, and the ECS task in another account fails its next pull with `CannotPullContainerError`. There's no console signal that consumers exist elsewhere. The only reliable signal is your own bookkeeping — repository policies you can read, or a CloudWatch metric / Lambda you've built — not the ECR UI.

If you're operating production registries shared across accounts, **never trust "not in use" as a deletion safety check.** Build your own.

---

## A working starter policy

Here's the policy I'd hand someone on day one with a multi-arch repo. Two rules, no untagged sweep, defensive defaults:

```json
{
  "rules": [
    {
      "rulePriority": 1,
      "description": "Keep last 30 release tags",
      "selection": {
        "tagStatus": "tagged",
        "tagPatternList": ["v*"],
        "countType": "imageCountMoreThan",
        "countNumber": 30
      },
      "action": { "type": "expire" }
    },
    {
      "rulePriority": 2,
      "description": "Expire feature-branch tags after 14 days",
      "selection": {
        "tagStatus": "tagged",
        "tagPatternList": ["feature-*"],
        "countType": "sinceImagePushed",
        "countUnit": "days",
        "countNumber": 14
      },
      "action": { "type": "expire" }
    }
  ]
}
```

No `tagStatus: untagged` rule at all. ECR's 24-hour reference-artifact sweep handles the orphans. No `ImageReferencedByManifestList` failures, because nothing in this policy ever targets a child manifest directly.

If you genuinely need to clean up untagged orphans from failed pushes, add a *third* rule with a 14-day-plus window — and never make it shorter than your shortest tag-retention rule.

---

## Closing thought

The thing I want operators to take away from this is the object model, not the JSON. `docker push` looks like an atomic operation, but in the registry it's a small graph. Once you can hold that graph in your head — manifest list at the top, image manifests below, config and layers below those, with the tag glued to the root — the lifecycle behavior stops being mysterious and the console stops being misleading.

The cryptic error message is doing its job. It's telling you, in a slightly unfriendly way, that your policy is trying to amputate a foot from a living patient. The right fix isn't to retry the deletion — it's to write rules that target the patient instead.

---

*I work AWS Containers support and write about the cases that make me actually understand the services. More coming on ECR, EKS, and Karpenter. — Kartikey ([github.com/kartikeytripathi](https://github.com/kartikeytripathi) · [linkedin.com/in/kartikeytripathi](https://linkedin.com/in/kartikeytripathi/))*

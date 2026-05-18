# What Actually Happens When You Run `kubectl apply`

*A walkthrough of every component your YAML touches — from your terminal to the running container.*

---

If you've ever paged through `kubernetes/kubernetes` on GitHub trying to understand why a Pod did or didn't show up, you know the feeling: there are *so many* moving parts, and the official docs tend to describe them as discrete boxes with arrows. What gets lost is the actual lifecycle — the chain of calls, watches, and reconciliations that turn five lines of YAML into a running container.

I've been spending time inside the source tree recently, partly out of curiosity and partly because I support production EKS clusters for a living. The cases that take the longest to debug are almost always the ones where the operator doesn't have a clean mental model of where their request goes after it leaves the terminal.

So here's that mental model. End to end. What really happens when you type:

```bash
kubectl apply -f deployment.yaml
```

---

## Stage 1: Inside kubectl

The first thing worth internalizing is that **kubectl is a thin client**. It does no scheduling, no orchestration, no validation against cluster state. It's a YAML parser, a config loader, and an HTTP client with some merge logic bolted on.

When you run `apply`, kubectl does roughly this:

1. **Loads your kubeconfig** — usually `~/.kube/config` — to find the current context, the API server URL, the CA bundle, and your credentials (client cert, token, or an exec plugin like `aws eks get-token`).
2. **Parses the manifest** into an internal object.
3. **Discovers the API** — it hits `/api` and `/apis` on the cluster to learn which resources exist and at which paths. This is cached at `~/.kube/cache/discovery/` so you don't pay this cost every command.
4. **Resolves your object's GroupVersionKind** to a REST endpoint (e.g., `apps/v1/Deployment` → `/apis/apps/v1/namespaces/<ns>/deployments`).
5. **Computes the patch.**

That last step is the interesting one. There are two flavors of apply:

| Mode | What kubectl sends | Who computes the diff |
|---|---|---|
| Client-side apply (legacy) | A computed three-way merge patch | kubectl |
| Server-side apply (default since v1.22+) | The full manifest plus a field manager name | The API server |

In client-side apply, kubectl GETs the live object, compares it to your file *and* the `kubectl.kubernetes.io/last-applied-configuration` annotation from the previous apply, computes a merge, and sends a PATCH. It's why "I deleted a field from my YAML but it's still set on the object" is a frequent confusion — without the last-applied annotation, kubectl can't tell whether you intentionally removed it or never set it.

Server-side apply pushes that work to the API server, which tracks ownership at the field level. Every field has a manager. If you and Argo CD both try to manage `replicas`, the server can tell you there's a conflict instead of silently overwriting.

Either way, what leaves your laptop is an HTTPS request to the API server.

---

## Stage 2: The API server pipeline

This is where most of the action lives. `kube-apiserver` is a single binary, but conceptually it's a pipeline of handlers wrapped around an etcd client. Every write goes through it in order:

```
Request → AuthN → AuthZ → Mutating Admission → Schema Validation → Validating Admission → Storage → Response
```

Let's walk through each.

### Authentication (AuthN)

The server asks: *who is making this request?* It runs through configured authenticators in order — x509 client certificates, bearer tokens, service account JWTs, OIDC, webhook authenticators (this is how EKS does it via the AWS IAM Authenticator / now the EKS Pod Identity webhook). The first authenticator that returns a positive answer wins.

If none succeed, you get a 401. No further pipeline runs.

### Authorization (AuthZ)

Now the server asks: *is this identity allowed to perform this action on this resource?* In almost every cluster today, this is RBAC — your user/group is checked against `ClusterRole` and `Role` bindings. Other authorizers (Node, ABAC, webhook) can also be wired in.

If you've ever debugged `User "X" cannot create resource "pods" in API group ""`, you've watched this stage fail.

### Mutating admission

Now the request is allowed in principle, but it can still be modified before it lands. Mutating admission controllers — both built-in (`DefaultStorageClass`, `ServiceAccount`) and dynamic webhooks (your service mesh sidecar injector, your policy engine) — get the object in sequence and can alter it.

This is where Linkerd injects its proxy, where Kyverno applies mutations, where the AWS Load Balancer Controller webhook stamps annotations.

### Schema validation

The mutated object is validated against the OpenAPI schema for its kind. Bad field names, wrong types, missing required fields all get rejected here.

### Validating admission

Same as mutating, but read-only. ValidatingWebhookConfigurations and ValidatingAdmissionPolicies (the newer CEL-based mechanism) get a final say.

This is where most policy enforcement lives — OPA Gatekeeper, Kyverno's validating policies, your "no `:latest` tag" rule.

### Storage

If all of the above pass, the API server serializes the object (protobuf for built-in types, JSON for CRDs unless configured otherwise) and writes it to etcd via the storage layer.

There's a subtlety here worth knowing: etcd writes are protected by **optimistic concurrency**. Every object has a `resourceVersion` field. If you GET an object, modify it, and PUT it back, the server checks that nobody else updated it in between. If they did, you get a 409 Conflict. This is why controllers and operators have retry loops everywhere.

### Watch event broadcast

The same write that hits etcd is also fanned out over the API server's **watch cache** to every client with an open watch on that resource. This is the mechanism that makes the rest of Kubernetes work — controllers, the scheduler, and kubelets all sit on long-lived watch connections, reacting to events as they're broadcast.

At this point, your `kubectl apply` returns success. From kubectl's perspective, the job is done.

From the cluster's perspective, almost nothing has happened yet.

---

## Stage 3: Controllers wake up

Let's say you applied a Deployment. The object now exists in etcd, but no Pods exist. The chain that bridges that gap is controllers — and there are more of them than you'd think.

Inside `kube-controller-manager`, there's a **Deployment controller** watching all Deployments. When it sees yours via the watch stream, it reconciles:

1. Reads the Deployment spec.
2. Looks for an existing ReplicaSet matching the pod-template-hash.
3. If none exists, creates one — via another API call, which goes through the same pipeline (auth, admission, storage, watch broadcast).

The **ReplicaSet controller** is also watching, and it now sees a new ReplicaSet. It reconciles:

1. Counts existing Pods owned by this ReplicaSet.
2. If fewer than desired, creates Pods — again, via the API server.

Each Pod creation triggers more admission webhooks (sidecar injectors typically run on Pods, not Deployments), more validation, more etcd writes, more watch events.

What you should notice: **there's no direct call from the Deployment controller to the ReplicaSet controller, or from the ReplicaSet controller to the kubelet.** Every component reads from and writes to the API server. The whole system is choreographed by shared state in etcd, observed via watches.

This is the part that took me the longest to internalize: Kubernetes is not a workflow engine. It's a bunch of independent loops, each watching the world and trying to make it match a desired state.

---

## Stage 4: The scheduler picks a node

The Pod now exists, but `pod.spec.nodeName` is empty. The **scheduler** has been watching for exactly this — pods that are unscheduled.

It runs the Pod through two phases:

| Phase | What it does | Example plugins |
|---|---|---|
| Filtering | Eliminates nodes that can't run the Pod at all | `NodeResourcesFit`, `NodeAffinity`, `TaintToleration`, `VolumeBinding` |
| Scoring | Ranks the remaining nodes | `ImageLocality`, `InterPodAffinity`, `NodeResourcesBalancedAllocation` |

The highest-scoring node wins. The scheduler then makes a **binding call** — a small API request that sets `pod.spec.nodeName` on the Pod. That's it. The scheduler does not talk to the node directly.

(On EKS with Karpenter, this gets more interesting: if no node fits, Karpenter — itself a controller watching unschedulable Pods — provisions a new EC2 instance, joins it to the cluster, and the scheduler then assigns the Pod on the next loop.)

---

## Stage 5: The kubelet takes over

Every node runs a `kubelet`, which is also watching the API server — specifically, watching for Pods where `spec.nodeName` matches its own. When the scheduler's binding write hits etcd and broadcasts, the kubelet sees its new Pod.

What the kubelet does next is a small symphony of subsystems:

1. **CRI (Container Runtime Interface)** — kubelet calls the runtime (containerd, CRI-O) to create a *sandbox*: the pause container that holds the network namespace.
2. **CNI (Container Network Interface)** — the runtime invokes the configured CNI plugin (Amazon VPC CNI on EKS, Calico, Cilium) to attach a network interface to the sandbox, assign an IP, and program routes.
3. **CSI (Container Storage Interface)** — for any volumes the Pod requests, the kubelet calls the CSI driver to attach (e.g., an EBS volume to the EC2 instance) and mount it into the right path.
4. **Image pull** — via CRI, the runtime pulls the container image from the registry. On EKS, this is where ECR auth via the kubelet credential provider plugin matters.
5. **Container start** — the runtime starts the app container inside the sandbox.
6. **Probes** — once running, the kubelet begins executing liveness, readiness, and startup probes on the schedule you defined.
7. **Status reporting** — the kubelet posts status updates back to the API server (`Pending` → `ContainerCreating` → `Running` → `Ready`), which the API server writes to etcd, which broadcasts to anyone watching.

That status broadcast is what finally turns your `kubectl get pods` from `Pending` to `Running`.

---

## Stage 6: Services and the data path

If your Pod is part of a Service, one more loop runs. The **EndpointSlice controller** watches Pods, matches them to Services by label selector, and writes EndpointSlice objects containing the Pod's IP and ports.

On every node, **kube-proxy** watches EndpointSlices and Services and programs the data path — usually iptables rules or IPVS entries — so that traffic to the Service's ClusterIP gets DNAT'd to one of the backend Pod IPs.

On EKS, if you're using the AWS Load Balancer Controller with `target-type: ip`, a different controller is watching: it sees the EndpointSlice updates and registers Pod IPs directly with an NLB or ALB target group, bypassing kube-proxy entirely for ingress traffic.

---

## What this changes about debugging

Once you internalize that *every component watches the API server and reconciles independently*, support cases start looking different. A few examples from things I've seen:

| Symptom | Where you'd look without the model | Where the problem usually is |
|---|---|---|
| Deployment created, no Pods appear | "Is my YAML right?" | ReplicaSet controller crashlooping, or an admission webhook timing out on Pod creation |
| Pod stuck `Pending` | "Out of memory?" | Filtering phase: every node failed a predicate (taint, affinity, volume topology zone) |
| Pod stuck `ContainerCreating` | "Bad image?" | CNI failure (IP exhaustion on VPC CNI), CSI attach hang, or image pull credentials |
| Pod `Running` but Service has no endpoints | "Is the Pod up?" | EndpointSlice controller isn't matching — label selector mismatch or `readinessProbe` failing |
| `kubectl apply` reports success, change doesn't stick | "Apply is broken?" | A mutating webhook is rewriting the field, or another field manager (Argo CD) is overwriting it on its next reconciliation |

None of these are obvious if you think of `kubectl apply` as "tells the cluster to make this thing." They become obvious — almost boring — once you see it as "writes a desired state to etcd; a dozen independent controllers will eventually argue about how to make reality match it."

---

## Closing thought

The single most useful idea buried in `kubernetes/kubernetes` is, I think, the one captured in every controller's main loop: *each controller reconciles the world*. That's the whole model. Your YAML doesn't *cause* anything directly — it changes the world's description, and a small army of loops takes it from there.

Once you see it that way, `kubectl apply` stops being a magic incantation and starts being what it actually is: a fancy way to write a row to a database.

---

*I'm writing more posts on Kubernetes internals and EKS production patterns from the support engineer's seat. Follow along if that sounds useful. — Kartikey ([github.com/kartikeytripathi](https://github.com/kartikeytripathi) · [linkedin.com/in/kartikeytripathi](https://linkedin.com/in/kartikeytripathi/))*

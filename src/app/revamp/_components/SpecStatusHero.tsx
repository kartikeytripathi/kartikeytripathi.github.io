"use client";

import { motion } from "framer-motion";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

/**
 * spec vs status split hero — states the career transition honestly, in the
 * idiom of a Kubernetes resource. Left = desired, right = observed.
 */
export function SpecStatusHero() {
  return (
    <section className="mx-auto flex min-h-[88vh] max-w-4xl flex-col justify-center px-6 pt-24 pb-16">
      <motion.p
        {...fade}
        transition={{ duration: 0.5 }}
        className="mb-8 font-mono text-xs uppercase tracking-[0.25em] text-gray-500"
      >
        # kartikey tripathi — cloud &amp; devops engineer
      </motion.p>

      <div className="grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] md:grid-cols-2">
        {/* spec — desired state */}
        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-black/60 p-7"
        >
          <div className="mb-4 flex items-center gap-2 font-mono text-xs text-gray-500">
            <span className="h-2 w-2 rounded-full bg-gray-600" />
            spec: <span className="text-gray-400">desired</span>
          </div>
          <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl">
            Senior DevOps Engineer
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Building and operating production Kubernetes at scale — the platform,
            the pipelines, and the guardrails around them.
          </p>
        </motion.div>

        {/* status — observed state */}
        <motion.div
          {...fade}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="bg-black/60 p-7"
        >
          <div className="mb-4 flex items-center gap-2 font-mono text-xs text-amber-400/80">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            status: <span className="text-amber-300/80">observed</span>
          </div>
          <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl">
            AWS Containers Support Engineer
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Deep EKS / ECS / Kubernetes internals every day — IRSA, Karpenter,
            networking, the failure modes most people only read about.
          </p>
        </motion.div>
      </div>

      <motion.p
        {...fade}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 font-mono text-sm text-gray-500"
      >
        <span className="text-amber-400">→</span> controller status:{" "}
        <span className="text-gray-300">converging.</span>{" "}
        <span className="text-gray-600">
          diffing desired against observed, one shipped thing at a time.
        </span>
      </motion.p>

      <motion.div
        {...fade}
        transition={{ duration: 0.6, delay: 0.55 }}
        className="mt-10 font-mono text-xs text-gray-600"
      >
        ↓ scroll to watch the loop reconcile
      </motion.div>
    </section>
  );
}

"use client";

import { SectionHeading } from "./SectionHeading";
import ContributionGraph from "@/components/ContributionGraph";
import { ErrorBoundary } from "@/components";

/**
 * GitHub activity reframed as an observability panel — real commit
 * throughput from the existing contribution graph, in the reconcile theme.
 */
export function Signals() {
  return (
    <section id="signals" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading
        kind="Metrics"
        name="signals"
        hint="# commit throughput — the uptime of the work"
      />
      <div className="rounded-xl border border-white/10 bg-black/40 p-5">
        <ErrorBoundary>
          <ContributionGraph />
        </ErrorBoundary>
      </div>
    </section>
  );
}

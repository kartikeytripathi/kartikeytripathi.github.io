"use client";

import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";

type Phase = "Reconciling" | "Converging" | "Synced";

const phaseFor = (p: number): Phase =>
  p < 0.12 ? "Reconciling" : p < 0.9 ? "Converging" : "Synced";

const phaseMeta: Record<Phase, { dot: string; text: string; label: string }> = {
  Reconciling: { dot: "bg-gray-500", text: "text-gray-400", label: "Reconciling…" },
  Converging: { dot: "bg-amber-500/70", text: "text-amber-300/80", label: "Converging" },
  Synced: { dot: "bg-amber-400", text: "text-amber-400", label: "Synced ✓" },
};

/**
 * Persistent controller status bar. Reads scroll progress and reports the
 * reconcile phase — plus the ⌘K and recruiter-view controls.
 */
export function ReconcileBar({
  onOpenPalette,
  onToggleRecruiter,
}: {
  onOpenPalette: () => void;
  onToggleRecruiter: () => void;
}) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const [phase, setPhase] = useState<Phase>("Reconciling");

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPhase(phaseFor(v));
  });

  const meta = phaseMeta[phase];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-6 py-2.5">
        <span className="hidden font-mono text-xs text-gray-500 sm:inline">
          <span className="text-gray-400">kind:</span>{" "}
          <span className="text-white">Engineer</span>{" "}
          <span className="text-gray-600">· kartikey.reconcile.io/v1</span>
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPalette}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-gray-400 transition-colors hover:border-white/20 hover:text-gray-200"
          >
            <span className="text-amber-400">$</span> get
            <kbd className="rounded border border-white/10 px-1 text-[10px] text-gray-500">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onToggleRecruiter}
            className="rounded-md border border-white/10 px-2 py-1 font-mono text-[11px] text-gray-400 transition-colors hover:border-amber-400/40 hover:text-amber-300"
          >
            <span className="sm:hidden">recruiter</span>
            <span className="hidden sm:inline">view as: recruiter</span>
          </button>

          <span
            className={`flex items-center gap-1.5 font-mono text-xs ${meta.text}`}
            aria-live="polite"
          >
            <span className="relative flex h-2 w-2">
              {phase === "Synced" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/60" />
              )}
              <span className={`relative inline-flex h-2 w-2 rounded-full ${meta.dot}`} />
            </span>
            <span className="hidden md:inline">{meta.label}</span>
          </span>
        </div>
      </div>

      <motion.div
        style={{ scaleX: progress }}
        className="h-px origin-left bg-gradient-to-r from-amber-500/40 via-amber-400 to-amber-300"
      />
    </header>
  );
}

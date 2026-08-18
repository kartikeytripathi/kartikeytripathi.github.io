"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronRight, FiExternalLink } from "react-icons/fi";

type DiffLine = { op: "-" | "+"; text: string };

export type ReconcileProjectData = {
  name: string;
  summary: string;
  href: string;
  desired: string[];
  converged: string[];
  metrics: { label: string; value: string }[];
};

/**
 * A project rendered as a reconciled resource. Collapsed = synced status.
 * Expanded = a `kubectl diff`: red desired vs green converged, then the
 * outcome metrics as status fields.
 */
export function ReconcileProject({ data }: { data: ReconcileProjectData }) {
  const [open, setOpen] = useState(false);

  const diff: DiffLine[] = [
    ...data.desired.map((text) => ({ op: "-" as const, text })),
    ...data.converged.map((text) => ({ op: "+" as const, text })),
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/40">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
      >
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="text-gray-500">
          <FiChevronRight className="h-4 w-4" />
        </motion.span>
        <span className="font-mono text-sm text-white">{data.name}</span>
        <span className="ml-auto flex items-center gap-1.5 font-mono text-xs text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Synced
        </span>
      </button>

      <div className="px-5 pb-4 -mt-1">
        <p className="pl-7 text-sm leading-relaxed text-gray-400">{data.summary}</p>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mx-5 mb-5 rounded-lg border border-white/10 bg-[#0A0A0A]">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2 font-mono text-xs text-gray-500">
                <span className="text-amber-400/70">$</span> kubectl diff {data.name.toLowerCase()}
              </div>

              <div className="space-y-0.5 p-4 font-mono text-xs leading-relaxed">
                {diff.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.05 }}
                    className={
                      line.op === "-"
                        ? "text-red-400/80"
                        : "text-emerald-400/90"
                    }
                  >
                    <span className="select-none opacity-60">{line.op} </span>
                    {line.text}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/5 px-4 py-3">
                {data.metrics.map((m) => (
                  <div key={m.label} className="font-mono text-xs">
                    <span className="text-gray-500">{m.label}: </span>
                    <span className="text-amber-400">{m.value}</span>
                  </div>
                ))}
                <a
                  href={data.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto flex items-center gap-1 font-mono text-xs text-gray-400 hover:text-white"
                >
                  view <FiExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

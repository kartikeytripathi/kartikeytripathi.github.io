"use client";

import { motion } from "framer-motion";

/** Shared section heading in the resource idiom: `kind/name` with a status dot. */
export function SectionHeading({
  kind,
  name,
  hint,
}: {
  kind: string;
  name: string;
  hint?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="text-gray-500">{kind}</span>
        <span className="text-gray-700">/</span>
        <span className="text-gray-300">{name}</span>
      </div>
      {hint && <p className="mt-2 font-mono text-xs text-gray-600">{hint}</p>}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { certifications } from "@/config/data";
import { SectionHeading } from "./SectionHeading";

export function CertConditions() {
  return (
    <section id="certs" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading
        kind="Condition"
        name="certifications"
        hint="# status.conditions[] — all True"
      />

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 border-b border-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-gray-600">
          <span>type</span>
          <span className="text-right">status</span>
          <span className="text-right">since</span>
        </div>
        {certifications.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-white/5 px-4 py-2.5 font-mono text-xs last:border-0"
          >
            <span className="flex min-w-0 items-center gap-2 text-gray-300">
              <span className="truncate">{c.title}</span>
              {c.url && (
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Verify ${c.title}`}
                  className="shrink-0 text-gray-600 hover:text-amber-400"
                >
                  <FiExternalLink className="h-3 w-3" />
                </a>
              )}
            </span>
            <span className="flex items-center justify-end gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              True
            </span>
            <span className="text-right text-gray-600">{c.issued}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

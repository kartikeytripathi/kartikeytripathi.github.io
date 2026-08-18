"use client";

import { motion } from "framer-motion";
import { workExperience } from "@/config/data";
import { SectionHeading } from "./SectionHeading";

export function ExperienceDeployments() {
  return (
    <section id="experience" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading
        kind="Deployment"
        name="experience"
        hint="# each role: a long-running deployment, still ready"
      />

      <div className="space-y-4">
        {workExperience.map((role, i) => {
          const current = i === 0;
          return (
            <motion.div
              key={`${role.company}-${role.period}`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="rounded-xl border border-white/10 bg-black/40 p-5"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="font-mono text-sm text-white">
                  {role.position}
                  <span className="text-gray-600"> @ </span>
                  <span className="text-gray-400">{role.tabLabel}</span>
                </h3>
                <span className="flex items-center gap-1.5 font-mono text-xs">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      current ? "bg-emerald-400" : "bg-gray-600"
                    }`}
                  />
                  <span className={current ? "text-emerald-400" : "text-gray-500"}>
                    {current ? "Ready" : "Terminated"}
                  </span>
                </span>
              </div>

              <div className="mt-1 flex flex-wrap gap-x-4 font-mono text-xs text-gray-600">
                <span>readySince: {role.period.split("–")[0].trim()}</span>
                <span>region: {role.location.split(",")[0]}</span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-gray-400">{role.shortDesc}</p>

              <ul className="mt-3 space-y-1.5">
                {role.bulletPoints.slice(0, 3).map((b, bi) => (
                  <li key={bi} className="flex gap-2 text-sm text-gray-500">
                    <span className="mt-0.5 shrink-0 font-mono text-emerald-400/60">+</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

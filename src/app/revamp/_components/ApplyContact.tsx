"use client";

import { motion } from "framer-motion";
import { personalInfo, socialLinks } from "@/config/data";
import { SectionHeading } from "./SectionHeading";

export function ApplyContact() {
  return (
    <section id="contact" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading kind="Service" name="contact" hint="# apply to reach the cluster" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]"
      >
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2 font-mono text-xs text-gray-500">
          <span className="text-amber-400/70">$</span> kubectl apply -f contact.yaml
        </div>

        <pre className="overflow-x-auto px-5 py-4 font-mono text-xs leading-relaxed text-gray-400">
          <span className="text-gray-600">apiVersion:</span> reach.me/v1{"\n"}
          <span className="text-gray-600">kind:</span> Conversation{"\n"}
          <span className="text-gray-600">metadata:</span>{"\n"}
          {"  "}<span className="text-gray-600">name:</span>{" "}
          <span className="text-white">{personalInfo.name}</span>{"\n"}
          {"  "}<span className="text-gray-600">location:</span>{" "}
          {personalInfo.location}{"\n"}
          <span className="text-gray-600">spec:</span>{"\n"}
          {"  "}<span className="text-gray-600">email:</span>{" "}
          <a
            href={`mailto:${personalInfo.email}`}
            className="text-amber-400 underline-offset-2 hover:underline"
          >
            {personalInfo.email}
          </a>
        </pre>

        <div className="flex flex-wrap gap-2 border-t border-white/5 px-5 py-4">
          {socialLinks.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-gray-400 transition-colors hover:border-amber-400/50 hover:text-amber-300"
            >
              {s.title}
            </a>
          ))}
        </div>
      </motion.div>

      <p className="mt-6 font-mono text-xs text-gray-600">
        <span className="text-amber-400">✓</span> deployment converged — desired
        state reached, still reconciling.
      </p>
    </section>
  );
}

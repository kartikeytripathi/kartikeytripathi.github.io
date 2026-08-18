"use client";

import { motion } from "framer-motion";
import { blogPosts, videos } from "@/config/blog";
import { workExperience } from "@/config/data";
import { SectionHeading } from "./SectionHeading";

type Event = { verb: string; obj: string; when: string; tone: "ship" | "watch" | "sync" };

const latestPost = blogPosts[0];
const latestVideo = videos[0];
const currentRole = workExperience[0];

// A controller log — the newest observed events, derived from real content.
const events: Event[] = [
  { verb: "published", obj: `blog/${latestPost.title}`, when: latestPost.date, tone: "ship" },
  { verb: "shipped", obj: "kubenotes.dev/carousel", when: "3x/week", tone: "ship" },
  { verb: "released", obj: `video/${latestVideo.title}`, when: latestVideo.date, tone: "ship" },
  { verb: "reconciling", obj: `role/${currentRole.position}`, when: currentRole.period, tone: "sync" },
  { verb: "watching", obj: "cka/exam-prep", when: "in progress", tone: "watch" },
];

const toneColor: Record<Event["tone"], string> = {
  ship: "text-emerald-400",
  watch: "text-amber-400",
  sync: "text-sky-400",
};

export function NowWatch() {
  return (
    <section id="now" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading kind="EventStream" name="now" hint="# recent reconcile events, newest first" />

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">
        <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2 font-mono text-xs text-gray-500">
          <span className="text-amber-400/70">$</span> kubectl get events --watch
        </div>
        <div className="divide-y divide-white/5">
          {events.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-baseline gap-3 px-4 py-2.5 font-mono text-xs"
            >
              <span className={`shrink-0 ${toneColor[e.tone]}`}>{e.verb}</span>
              <span className="min-w-0 flex-1 truncate text-gray-300">{e.obj}</span>
              <span className="shrink-0 text-gray-600">{e.when}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

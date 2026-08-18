"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import { blogPosts, videos } from "@/config/blog";
import { SectionHeading } from "./SectionHeading";

type Item = {
  key: string;
  kind: "article" | "video";
  title: string;
  date: string;
  href: string;
  tags: string[];
};

const items: Item[] = [
  ...blogPosts.map((p) => ({
    key: `b-${p.slug}`,
    kind: (p.type === "video" ? "video" : "article") as Item["kind"],
    title: p.title,
    date: p.date,
    href: p.externalUrl ?? `https://blogs.kartikeytripathi.in/${p.slug}`,
    tags: p.tags.slice(0, 3),
  })),
  ...videos.map((v) => ({
    key: `v-${v.videoId}`,
    kind: "video" as const,
    title: v.title,
    date: v.date,
    href: v.url,
    tags: v.tags.slice(0, 3),
  })),
];

const filters = ["all", "article", "video"] as const;

export function ContentHub() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all");

  const shown = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.kind === filter)),
    [filter]
  );

  return (
    <section id="content" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20">
      <SectionHeading
        kind="Stream"
        name="content"
        hint="# what I'm broadcasting — blog, video, kubenotes"
      />

      <div className="mb-5 flex gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
              filter === f
                ? "border-amber-400/60 bg-amber-400/10 text-amber-300"
                : "border-white/10 text-gray-500 hover:text-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((item) => (
            <motion.a
              key={item.key}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-xl border border-white/10 bg-black/40 p-4 transition-colors hover:border-amber-400/40 hover:bg-white/[0.03]"
            >
              <div className="mb-2 flex items-center justify-between font-mono text-xs">
                <span
                  className={
                    item.kind === "video" ? "text-red-400" : "text-purple-400"
                  }
                >
                  {item.kind === "video" ? "▶ video" : "✦ article"}
                </span>
                <span className="text-gray-600">{item.date}</span>
              </div>
              <h3 className="mb-3 line-clamp-2 text-sm font-semibold leading-snug text-white">
                {item.title}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-sm border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-gray-500"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <FiExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-600 transition-colors group-hover:text-amber-400" />
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

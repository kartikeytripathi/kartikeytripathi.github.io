"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/config/blog";

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      }
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag = !activeTag || post.tags.includes(activeTag);
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [posts, query, activeTag]);

  return (
    <div>
      {/* Search + tag filter */}
      <div className="mb-8 space-y-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm font-mono text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/60"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={`text-xs font-mono px-2 py-0.5 rounded-sm border transition-colors ${
              activeTag === null
                ? "border-indigo-500/60 bg-indigo-950/40 text-indigo-300"
                : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((cur) => (cur === tag ? null : tag))}
              className={`text-xs font-mono px-2 py-0.5 rounded-sm border transition-colors ${
                activeTag === tag
                  ? "border-indigo-500/60 bg-indigo-950/40 text-indigo-300"
                  : "border-gray-800 bg-gray-900 text-gray-400 hover:border-gray-600"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-600 font-mono">
          No posts match &ldquo;{query}&rdquo;{activeTag ? ` in ${activeTag}` : ""}.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <Link
              key={post.slug}
              href={post.externalUrl ?? `/blog/${post.slug}`}
              target={post.externalUrl ? "_blank" : undefined}
              rel={post.externalUrl ? "noopener noreferrer" : undefined}
              className="group block border border-border rounded-sm overflow-hidden hover:border-gray-600 transition-colors duration-200"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-gray-900 overflow-hidden">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-950/60 to-purple-950/60 p-6">
                    <p className="text-sm font-mono text-gray-300 text-center line-clamp-3 leading-relaxed">
                      {post.title}
                    </p>
                  </div>
                )}
                <span className="absolute top-2 left-2 text-xs font-mono px-2 py-0.5 rounded-sm bg-black/70 text-gray-300 border border-gray-700">
                  {post.type === "video" ? "▶ VIDEO" : "✦ ARTICLE"}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">
                    {post.date}
                  </span>
                  {post.publishedOn && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="text-xs font-mono text-orange-400">
                        {post.publishedOn}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-sm font-semibold leading-snug mb-2 group-hover:text-gray-300 transition-colors line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

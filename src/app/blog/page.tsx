import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/config/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Kartikey Tripathi",
  description:
    "Articles and videos by Kartikey Tripathi on AWS, Cloud, DevOps, and Kubernetes.",
  alternates: {
    canonical: "https://www.kartikeytripathi.in/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-8">
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-2xl font-bold font-mono">Blog</h1>
          <div className="flex-1 h-px bg-border" />
        </div>
        <p className="text-muted-foreground text-sm font-mono">
          Articles, videos, and write-ups on Cloud, DevOps, and Kubernetes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogPosts.map((post) => (
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
    </main>
  );
}

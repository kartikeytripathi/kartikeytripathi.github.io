import { blogPosts } from "@/config/blog";
import BlogListClient from "./BlogListClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Kartikey Tripathi",
  description:
    "Articles and videos by Kartikey Tripathi on AWS, Cloud, DevOps, and Kubernetes.",
  alternates: {
    canonical: "https://blogs.kartikeytripathi.in",
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

      <BlogListClient posts={blogPosts} />
    </main>
  );
}

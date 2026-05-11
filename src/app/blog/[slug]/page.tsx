import Link from "next/link";
import { blogPosts } from "@/config/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} — Kartikey Tripathi`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <main className="max-w-4xl mx-auto p-6 lg:p-8">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-sm font-mono text-muted-foreground hover:text-white transition-colors mb-8"
      >
        ← Blog
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs font-mono px-2 py-0.5 rounded-sm bg-gray-900 border border-gray-800 text-gray-400">
          {post.type === "video" ? "▶ VIDEO" : "✦ ARTICLE"}
        </span>
        <span className="text-xs font-mono text-muted-foreground">{post.date}</span>
        {post.publishedOn && (
          <>
            <span className="text-gray-700">·</span>
            <span className="text-xs font-mono text-orange-400">{post.publishedOn}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl lg:text-3xl font-bold leading-snug mb-4">
        {post.title}
      </h1>

      <p className="text-muted-foreground leading-relaxed mb-8">{post.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-8">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs font-mono px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Video embed */}
      {post.type === "video" && post.videoId && (
        <div className="relative w-full aspect-video rounded-sm overflow-hidden border border-border">
          <iframe
            src={`https://www.youtube.com/embed/${post.videoId}`}
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      )}
    </main>
  );
}

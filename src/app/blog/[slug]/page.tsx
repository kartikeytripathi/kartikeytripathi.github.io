import Link from "next/link";
import { blogPosts, getRelatedPosts } from "@/config/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import ArticleBody from "./ArticleBody";
import BlogEngagement from "./BlogEngagement";
import TableOfContents, { type TocItem } from "./TableOfContents";
import { ArticleProgress } from "@/components";
import { slugify } from "@/lib/slugify";

type Props = { params: Promise<{ slug: string }> };

function extractH2Headings(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const match = /^##\s+(.+)$/.exec(line.trim());
    if (!match) continue;
    const rawText = match[1].trim();
    const text = rawText
      .replace(/[`*_]/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
    items.push({ text, slug: slugify(rawText) });
  }
  return items;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  const canonical = `https://blogs.kartikeytripathi.in/${slug}`;
  return {
    title: `${post.title} — Kartikey Tripathi`,
    description: post.description,
    authors: [{ name: "Kartikey Tripathi", url: "https://kartikeytripathi.in" }],
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.description,
      url: canonical,
      siteName: "Kartikey Tripathi",
      type: "article",
      publishedTime: post.date,
      authors: ["Kartikey Tripathi"],
      tags: post.tags,
      ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      ...(post.thumbnail ? { images: [post.thumbnail] } : {}),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug, post.tags);

  let markdown: string | null = null;
  if (post.type === "article") {
    try {
      const filePath = path.join(
        process.cwd(),
        "src/content/blog",
        `${slug}.md`
      );
      const raw = await readFile(filePath, "utf-8");
      markdown = raw.replace(/^---[\s\S]*?---\n?/, "");
    } catch {
      markdown = null;
    }
  }

  const toc = markdown ? extractH2Headings(markdown) : [];
  const hasToc = toc.length >= 3;

  const canonical = `https://blogs.kartikeytripathi.in/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Person",
      name: "Kartikey Tripathi",
      url: "https://kartikeytripathi.in",
    },
    datePublished: post.date,
    url: canonical,
    keywords: post.tags.join(", "),
  };

  return (
    <main className={`mx-auto p-6 lg:p-8 overflow-x-hidden ${hasToc ? "max-w-6xl" : "max-w-4xl"}`}>
      {post.type === "article" && markdown && (
        <ArticleProgress targetId="article-content" />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(/>/g, "\\u003e")
            .replace(/&/g, "\\u0026"),
        }}
      />
      <div className={hasToc ? "max-w-4xl mx-auto" : undefined}>
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
      </div>

      <div className={hasToc ? "flex flex-col lg:flex-row gap-10 items-start" : undefined}>
        <div className={hasToc ? "min-w-0 flex-1 max-w-4xl mx-auto lg:mx-0" : undefined}>
          {/* Article body */}
          {post.type === "article" && markdown && (
            <ArticleBody content={markdown} />
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-14 pt-8 border-t border-gray-800">
              <h2 className="text-sm font-mono text-gray-500 mb-4">
                Keep reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={related.externalUrl ?? `/blog/${related.slug}`}
                    target={related.externalUrl ? "_blank" : undefined}
                    rel={related.externalUrl ? "noopener noreferrer" : undefined}
                    className="group block p-4 rounded-sm border border-gray-800 hover:border-gray-600 transition-colors duration-200"
                  >
                    <span className="text-xs font-mono text-muted-foreground">
                      {related.type === "video" ? "▶ VIDEO" : "✦ ARTICLE"}
                    </span>
                    <h3 className="text-sm font-semibold leading-snug mt-1.5 mb-1 group-hover:text-gray-300 transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {related.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(post.type === "article" || post.type === "video") && (
            <BlogEngagement slug={slug} />
          )}
        </div>

        {hasToc && <TableOfContents items={toc} />}
      </div>
    </main>
  );
}

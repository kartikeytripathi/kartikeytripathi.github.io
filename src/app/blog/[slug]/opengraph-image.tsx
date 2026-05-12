import { ImageResponse } from "next/og";
import { blogPosts } from "@/config/blog";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function BlogPostOGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  const title = post?.title ?? "Blog — Kartikey Tripathi";
  const tags = post?.tags ?? [];
  const date = post?.date ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#040404",
          padding: "64px",
          fontFamily: "monospace",
        }}
      >
        {/* Top gradient bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(to right, #6366f1, #a855f7, #60a5fa)",
          }}
        />

        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: "50%",
            width: 800,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
            transform: "translateX(-50%)",
          }}
        />

        {/* Article badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              fontSize: 13,
              color: "#a5b4fc",
              border: "1px solid rgba(99,102,241,0.4)",
              padding: "4px 12px",
              borderRadius: 4,
            }}
          >
            ✦ ARTICLE
          </div>
          {date && (
            <div style={{ fontSize: 13, color: "#6b7280" }}>{date}</div>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 60 ? 42 : 52,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.2,
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            {tags.slice(0, 4).map((tag) => (
              <div
                key={tag}
                style={{
                  fontSize: 12,
                  color: "#9ca3af",
                  border: "1px solid #1f2937",
                  padding: "3px 10px",
                  borderRadius: 4,
                  backgroundColor: "#111827",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, color: "#6b7280" }}>
            kartikeytripathi.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

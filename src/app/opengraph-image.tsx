import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kartikey Tripathi | Cloud & DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#080808",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top-right glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Bottom-left glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "3px",
            background:
              "linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent)",
          }}
        />

        {/* Name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "16px",
          }}
        >
          Kartikey Tripathi
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: "400",
            color: "#a1a1aa",
            marginBottom: "48px",
            letterSpacing: "0.5px",
          }}
        >
          Cloud &amp; DevOps Engineer
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "60px" }}>
          {["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                border: "1px solid #27272a",
                borderRadius: "4px",
                color: "#71717a",
                fontSize: "18px",
                background: "#111111",
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* Domain */}
        <div
          style={{
            fontSize: "22px",
            color: "#8b5cf6",
            letterSpacing: "1px",
          }}
        >
          kartikeytripathi.in
        </div>
      </div>
    ),
    { ...size }
  );
}

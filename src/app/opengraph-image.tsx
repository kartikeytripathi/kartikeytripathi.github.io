import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Kartikey Tripathi | Cloud & DevOps Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const avatarUrl = "https://www.kartikeytripathi.in/images/about/KT.webp";
  let avatarSrc: string = avatarUrl;

  try {
    const res = await fetch(avatarUrl);
    const buf = await res.arrayBuffer();
    const b64 = Buffer.from(buf).toString("base64");
    avatarSrc = `data:image/webp;base64,${b64}`;
  } catch {
    // fallback to URL if fetch fails
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#080808",
          display: "flex",
          alignItems: "center",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
          gap: "64px",
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
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
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
            background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
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
            background: "linear-gradient(90deg, transparent, #8b5cf6, #3b82f6, transparent)",
          }}
        />

        {/* Avatar */}
        <img
          src={avatarSrc}
          width={200}
          height={200}
          style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "3px solid #27272a" }}
        />

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* Name */}
          <div
            style={{
              fontSize: "68px",
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1.1,
              marginBottom: "14px",
            }}
          >
            Kartikey Tripathi
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "30px",
              fontWeight: "400",
              color: "#a1a1aa",
              marginBottom: "40px",
              letterSpacing: "0.5px",
            }}
          >
            Cloud &amp; DevOps Engineer
          </div>

          {/* Tags */}
          <div style={{ display: "flex", gap: "12px", marginBottom: "48px" }}>
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
          <div style={{ fontSize: "22px", color: "#8b5cf6", letterSpacing: "1px" }}>
            kartikeytripathi.in
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

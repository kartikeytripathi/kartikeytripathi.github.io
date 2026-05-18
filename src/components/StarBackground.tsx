"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
};

const STAR_COLORS = [
  "255,255,255",   // white (most common)
  "255,255,255",
  "255,255,255",
  "200,220,255",   // cool blue-white
  "255,240,200",   // warm amber-white
];

function buildStars(w: number, h: number): Star[] {
  const count = Math.min(Math.floor((w * h) / 6000), 280);
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() < 0.12 ? Math.random() * 1.2 + 0.9 : Math.random() * 0.8 + 0.2,
    baseOpacity: Math.random() * 0.55 + 0.15,
    twinkleSpeed: Math.random() * 0.4 + 0.15,
    twinkleOffset: Math.random() * Math.PI * 2,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  }));
}

export function StarBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrame: number;
    let stars: Star[] = [];
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      stars = buildStars(canvas.width, canvas.height);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      // Subtle galaxy glow — off-center nebula core
      const cx = canvas.width * 0.62;
      const cy = canvas.height * 0.28;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.45);
      glow.addColorStop(0, "rgba(99,102,241,0.055)");
      glow.addColorStop(0.45, "rgba(56,189,248,0.025)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (const s of stars) {
        const opacity = s.baseOpacity * (0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));

        // Glow halo for larger stars
        if (s.radius > 1) {
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 4);
          halo.addColorStop(0, `rgba(${s.color},${(opacity * 0.4).toFixed(3)})`);
          halo.addColorStop(1, `rgba(${s.color},0)`);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }

        // Star core
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${opacity.toFixed(3)})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: -1 }}
    />
  );
}

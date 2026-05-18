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

type Shooter = {
  x: number;
  y: number;
  len: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
};

const COLORS = ["255,255,255", "255,255,255", "200,220,255", "255,240,200"];

function buildStars(w: number, h: number): Star[] {
  // ~60–90 stars total — sparse and elegant
  const count = Math.min(Math.floor((w * h) / 22000), 90);
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    radius: Math.random() < 0.1 ? Math.random() * 0.9 + 0.7 : Math.random() * 0.5 + 0.15,
    baseOpacity: Math.random() * 0.35 + 0.08,
    twinkleSpeed: Math.random() * 0.25 + 0.08,
    twinkleOffset: Math.random() * Math.PI * 2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));
}

function buildShooter(w: number): Shooter {
  return {
    x: Math.random() * w * 0.7,
    y: Math.random() * 200,
    len: Math.random() * 120 + 60,
    speed: Math.random() * 6 + 5,
    angle: Math.PI / 5,
    opacity: 0,
    active: false,
  };
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
    let shooterTimer = 0;
    const shooters: Shooter[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      stars = buildStars(canvas.width, canvas.height);
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;
      shooterTimer += 0.01;

      // Nebula glow
      const cx = canvas.width * 0.65;
      const cy = canvas.height * 0.22;
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.42);
      glow.addColorStop(0, "rgba(99,102,241,0.04)");
      glow.addColorStop(0.5, "rgba(56,189,248,0.015)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars
      for (const s of stars) {
        const opacity = s.baseOpacity * (0.6 + 0.4 * Math.sin(t * s.twinkleSpeed + s.twinkleOffset));
        if (s.radius > 0.65) {
          const halo = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.radius * 3.5);
          halo.addColorStop(0, `rgba(${s.color},${(opacity * 0.3).toFixed(3)})`);
          halo.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = halo;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${s.color},${opacity.toFixed(3)})`;
        ctx.fill();
      }

      // Shooting stars — one every ~8 s
      if (shooterTimer > 8 + Math.random() * 4) {
        shooterTimer = 0;
        const s = buildShooter(canvas.width);
        s.active = true;
        s.opacity = 0.9;
        shooters.push(s);
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const s = shooters[i];
        if (!s.active) continue;
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.018;
        if (s.opacity <= 0 || s.x > canvas.width || s.y > canvas.height) {
          shooters.splice(i, 1);
          continue;
        }
        const tx = s.x - Math.cos(s.angle) * s.len;
        const ty = s.y - Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
        grad.addColorStop(0, "rgba(255,255,255,0)");
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity.toFixed(3)})`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
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

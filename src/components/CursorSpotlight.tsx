"use client";

import { useEffect, useRef } from "react";

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
    };

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed z-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        background:
          "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)",
        transition: "left 80ms linear, top 80ms linear",
      }}
    />
  );
}

"use client";

import { useEffect, useState } from "react";

export function ArticleProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById(targetId);
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const trackLength = el.offsetHeight - window.innerHeight;

      if (trackLength <= 0) {
        setProgress(window.scrollY >= articleTop ? 100 : 0);
        return;
      }

      const pct = ((window.scrollY - articleTop) / trackLength) * 100;
      setProgress(Math.min(100, Math.max(0, pct)));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [targetId]);

  return (
    <div aria-hidden="true" className="fixed top-0 left-0 z-50 h-[2px] w-full">
      <div
        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

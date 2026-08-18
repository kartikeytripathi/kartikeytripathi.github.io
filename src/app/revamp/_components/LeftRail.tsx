"use client";

import { useEffect, useState } from "react";
import { SECTIONS } from "./sections";

/**
 * Fixed left rail styled as `kubectl get` output — one row per section with a
 * live status dot that lights amber when that section is in view. xl screens only.
 */
export function LeftRail({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [active, setActive] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="space-y-1 font-mono text-xs">
        {SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => onNavigate(s.id)}
                className="group flex items-center gap-2 py-0.5"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    on ? "bg-amber-400" : "bg-gray-700 group-hover:bg-gray-500"
                  }`}
                />
                <span
                  className={`transition-colors ${
                    on ? "text-gray-200" : "text-gray-600 group-hover:text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

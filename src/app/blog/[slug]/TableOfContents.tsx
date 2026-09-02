"use client";

import { useEffect, useState } from "react";

export type TocItem = { text: string; slug: string };

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeSlug, setActiveSlug] = useState<string>("");

  useEffect(() => {
    const observers = items.map(({ slug }) => {
      const el = document.getElementById(slug);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSlug(slug);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });

    return () => {
      observers.forEach((obs, i) => {
        const el = document.getElementById(items[i].slug);
        if (obs && el) obs.unobserve(el);
      });
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    document.getElementById(slug)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      aria-label="Table of contents"
      className="hidden lg:block sticky top-24 self-start w-56 shrink-0 max-h-[calc(100vh-7rem)] overflow-y-auto"
    >
      <p className="text-xs font-mono text-gray-600 uppercase tracking-wide mb-3">
        On this page
      </p>
      <ul className="space-y-2 border-l border-gray-800">
        {items.map(({ text, slug }) => (
          <li key={slug}>
            <a
              href={`#${slug}`}
              onClick={(e) => handleClick(e, slug)}
              className={`block pl-3 -ml-px border-l text-sm leading-snug transition-colors duration-150 ${
                activeSlug === slug
                  ? "border-indigo-400 text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

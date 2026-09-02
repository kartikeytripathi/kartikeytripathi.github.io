"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Videos", href: "#videos" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const [activeSection, setActiveSection] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));

    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      return obs;
    });

    return () => {
      observers.forEach((obs, i) => {
        const el = document.getElementById(ids[i]);
        if (obs && el) obs.unobserve(el);
      });
    };
  }, []);

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-20 px-6 py-3 bg-black/50 backdrop-blur-sm font-mono"
    >
      <nav className="w-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="https://www.kartikeytripathi.in"
          className="flex gap-2 items-center shrink-0"
        >
          <Image
            src="/images/about/KT.webp"
            alt="Kartikey Tripathi"
            className="rounded-full h-8 w-8 object-cover"
            width={50}
            height={50}
          />
          <span className="text-lg text-white">kartikeytripathi</span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(({ label, href }) => {
            const id = href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={label}
                href={href}
                onClick={(e) => handleScroll(e, href)}
                className={`relative text-sm transition-colors duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-200"
                }`}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 left-0 right-0 h-px bg-indigo-400"
                  />
                )}
              </a>
            );
          })}
        </div>

        {/* AWS chip */}
        <span className="text-xs font-mono px-2.5 py-1 rounded-sm border border-orange-800/60 text-orange-400 bg-orange-950/30 shrink-0">
          <span className="md:hidden">@ AWS</span>
          <span className="hidden md:inline">@ Amazon Web Services</span>
        </span>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="md:hidden shrink-0 p-1.5 -mr-1.5 text-gray-300 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-4 pb-1">
              {navLinks.map(({ label, href }) => {
                const id = href.slice(1);
                const isActive = activeSection === id;
                return (
                  <a
                    key={label}
                    href={href}
                    onClick={(e) => handleScroll(e, href)}
                    className={`text-sm py-2 transition-colors duration-200 ${
                      isActive ? "text-white" : "text-gray-500 hover:text-gray-200"
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

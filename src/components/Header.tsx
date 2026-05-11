"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

export function Header() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
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
        <Link href="https://www.kartikeytripathi.in" className="flex gap-2 items-center shrink-0">
          <Image
            src="https://i.pinimg.com/1200x/fc/5d/7c/fc5d7c4dd0339b2053ddd781e6626d49.jpg"
            alt="Kartikey Tripathi"
            className="rounded-full h-8 w-8"
            width={50}
            height={50}
          />
          <span className="text-lg text-white">kartikeytripathi</span>
        </Link>

        {/* Nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => handleScroll(e, href)}
              className="text-sm text-gray-500 hover:text-gray-200 transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* AWS chip */}
        <span className="text-xs font-mono px-2.5 py-1 rounded-sm border border-orange-800/60 text-orange-400 bg-orange-950/30 shrink-0">
          @ Amazon Web Services
        </span>
      </nav>
    </motion.header>
  );
}

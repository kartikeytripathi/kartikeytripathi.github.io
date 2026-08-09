"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBriefcase,
  FiCode,
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiMessageSquare,
  FiSearch,
  FiUser,
  FiAward,
  FiBookOpen,
  FiExternalLink,
} from "react-icons/fi";
import { BsDiagram3 } from "react-icons/bs";

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  category: string;
  action: () => void;
};

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const openUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

const ALL_COMMANDS: Command[] = [
  // Navigation
  {
    id: "nav-home",
    label: "Go to Top",
    description: "Scroll to the top of the page",
    icon: <FiUser />,
    category: "Navigation",
    action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
  },
  {
    id: "nav-experience",
    label: "Work Experience",
    description: "View professional journey",
    icon: <FiBriefcase />,
    category: "Navigation",
    action: () => scrollTo("experience"),
  },
  {
    id: "nav-skills",
    label: "Tech Arsenal",
    description: "Browse skills and technologies",
    icon: <FiCode />,
    category: "Navigation",
    action: () => scrollTo("skills"),
  },
  {
    id: "nav-projects",
    label: "Projects",
    description: "See what I've built",
    icon: <FiCode />,
    category: "Navigation",
    action: () => scrollTo("projects"),
  },
  {
    id: "nav-certifications",
    label: "Certifications",
    description: "AWS and cloud certifications",
    icon: <FiAward />,
    category: "Navigation",
    action: () => scrollTo("certifications"),
  },
  {
    id: "nav-blog",
    label: "Blog",
    description: "Read articles on DevOps and Kubernetes",
    icon: <FiBookOpen />,
    category: "Navigation",
    action: () => scrollTo("blog"),
  },
  {
    id: "nav-contact",
    label: "Contact",
    description: "Get in touch",
    icon: <FiMessageSquare />,
    category: "Navigation",
    action: () => scrollTo("contact"),
  },

  // Social
  {
    id: "social-github",
    label: "GitHub",
    description: "github.com/kartikeytripathi",
    icon: <FiGithub />,
    category: "Links",
    action: () => openUrl("https://github.com/kartikeytripathi"),
  },
  {
    id: "social-linkedin",
    label: "LinkedIn",
    description: "linkedin.com/in/kartikeytripathi",
    icon: <FiLinkedin />,
    category: "Links",
    action: () => openUrl("https://www.linkedin.com/in/kartikeytripathi"),
  },
  {
    id: "social-instagram",
    label: "Instagram",
    description: "@kar.ti.key",
    icon: <FiInstagram />,
    category: "Links",
    action: () => openUrl("https://www.instagram.com/kar.ti.key"),
  },
  {
    id: "social-diagrams",
    label: "AWS Diagrams",
    description: "diagrams.kartikeytripathi.in",
    icon: <BsDiagram3 />,
    category: "Links",
    action: () => openUrl("https://diagrams.kartikeytripathi.in"),
  },
  {
    id: "social-email",
    label: "Send Email",
    description: "contact@kartikeytripathi.in",
    icon: <FiMail />,
    category: "Links",
    action: () => openUrl("mailto:contact@kartikeytripathi.in"),
  },
  {
    id: "social-topmate",
    label: "Schedule a Call",
    description: "Book time on Topmate",
    icon: <FiExternalLink />,
    category: "Links",
    action: () => openUrl("https://topmate.io/kartikeytripathi"),
  },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_COMMANDS;

  // Group by category
  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.category] ??= []).push(cmd);
    return acc;
  }, {});

  // Flat list for keyboard nav
  const flat = Object.values(grouped).flat();

  const closepalette = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  };

  const runCommand = (cmd: Command) => {
    cmd.action();
    closepalette();
  };

  // Open/close with Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") closepalette();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keep active item scrolled into view
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const cmd = flat[activeIndex];
      if (cmd) runCommand(cmd);
    }
  };

  // Track global index across groups for highlight
  let globalIndex = 0;

  return (
    <>
      {/* Keyboard hint shown in header area */}
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg
          border border-blue-500/20 bg-gray-900/40 hover:bg-gray-800/60
          text-gray-400 hover:text-gray-200 text-xs transition-all duration-200 select-none"
        aria-label="Open command palette"
      >
        <FiSearch className="w-3.5 h-3.5" />
        <span>Search</span>
        <kbd className="ml-1 px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={closepalette}
            />

            {/* Palette */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2
                bg-gray-950 border border-blue-500/30 rounded-xl shadow-2xl overflow-hidden"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-800">
                <FiSearch className="w-4 h-4 text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search commands, sections, links…"
                  className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500
                    outline-none caret-amber-400"
                />
                <kbd className="shrink-0 px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700
                  text-[10px] font-mono text-gray-400">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div
                ref={listRef}
                className="max-h-[340px] overflow-y-auto py-2 scrollbar-none"
              >
                {flat.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-gray-500">
                    No results for &quot;{query}&quot;
                  </p>
                ) : (
                  Object.entries(grouped).map(([category, cmds]) => (
                    <div key={category}>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                        {category}
                      </p>
                      {cmds.map((cmd) => {
                        const idx = globalIndex++;
                        const isActive = idx === activeIndex;
                        return (
                          <button
                            key={cmd.id}
                            data-index={idx}
                            onClick={() => runCommand(cmd)}
                            onMouseEnter={() => setActiveIndex(idx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left
                              transition-colors duration-100
                              ${isActive ? "bg-blue-600/20 text-white" : "text-gray-300 hover:bg-gray-800/50"}`}
                          >
                            <span className={`shrink-0 ${isActive ? "text-amber-400" : "text-gray-500"}`}>
                              {cmd.icon}
                            </span>
                            <span className="flex-1 min-w-0">
                              <span className="block text-sm font-medium truncate">{cmd.label}</span>
                              {cmd.description && (
                                <span className="block text-xs text-gray-500 truncate">{cmd.description}</span>
                              )}
                            </span>
                            {isActive && (
                              <kbd className="shrink-0 px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700
                                text-[10px] font-mono text-gray-400">
                                ↵
                              </kbd>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-800 text-[10px] text-gray-600">
                <span><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span><kbd className="font-mono">↵</kbd> select</span>
                <span><kbd className="font-mono">esc</kbd> close</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

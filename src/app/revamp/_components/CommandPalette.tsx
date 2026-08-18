"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTIONS } from "./sections";

type Command = {
  id: string;
  label: string;
  hint: string;
  run: () => void;
};

export function CommandPalette({
  open,
  onClose,
  onNavigate,
  onToggleRecruiter,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
  onToggleRecruiter: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <PaletteModal
          onClose={onClose}
          onNavigate={onNavigate}
          onToggleRecruiter={onToggleRecruiter}
        />
      )}
    </AnimatePresence>
  );
}

/** Only mounted while open — so its state resets naturally on each open. */
function PaletteModal({
  onClose,
  onNavigate,
  onToggleRecruiter,
}: {
  onClose: () => void;
  onNavigate: (id: string) => void;
  onToggleRecruiter: () => void;
}) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = useMemo(
    () => [
      ...SECTIONS.map((s) => ({
        id: `get-${s.id}`,
        label: `get ${s.label}`,
        hint: s.kind,
        run: () => onNavigate(s.id),
      })),
      {
        id: "recruiter",
        label: "view as recruiter",
        hint: "toggle résumé mode",
        run: onToggleRecruiter,
      },
    ],
    [onNavigate, onToggleRecruiter]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // focusing a DOM node is an external-system effect (no React state set here)
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, []);

  const onQueryChange = (v: string) => {
    setQuery(v);
    setCursor(0);
  };

  const runAt = (i: number) => {
    const cmd = filtered[i];
    if (!cmd) return;
    cmd.run();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      runAt(cursor);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[18vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-[#0A0A0A] shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 font-mono text-sm">
          <span className="text-amber-400">$</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="kubectl get …"
            className="w-full bg-transparent text-white placeholder:text-gray-600 focus:outline-none"
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-gray-500">
            esc
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center font-mono text-xs text-gray-600">
              No resources found.
            </div>
          )}
          {filtered.map((c, i) => (
            <button
              key={c.id}
              onMouseEnter={() => setCursor(i)}
              onClick={() => runAt(i)}
              className={`flex w-full items-center justify-between px-4 py-2 text-left font-mono text-sm ${
                i === cursor ? "bg-amber-400/10 text-amber-200" : "text-gray-300"
              }`}
            >
              <span>{c.label}</span>
              <span className="text-xs text-gray-600">{c.hint}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

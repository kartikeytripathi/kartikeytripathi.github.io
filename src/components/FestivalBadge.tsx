"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Festival } from "@/config/festivals";

export function FestivalBadge({ festival }: { festival: Festival | null }) {
  const [showMessage, setShowMessage] = useState(false);

  if (!festival) return null;

  const handleClick = async () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);

    try {
      const { default: confetti } = await import("canvas-confetti");
      confetti({
        particleCount: 60,
        spread: 65,
        startVelocity: 40,
        gravity: 0.9,
        scalar: 1.05,
        ticks: 100,
        origin: { x: 0.1, y: 0.85 },
        colors: [festival.accent, "#ffffff", "#9ca3af"],
      });
    } catch {
      // confetti is non-critical
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
      className="fixed bottom-24 left-4 md:left-6 z-40 flex flex-col items-start gap-1.5"
    >
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="px-3 py-1.5 rounded-lg border backdrop-blur-sm shadow-lg text-xs font-mono whitespace-nowrap bg-gray-900/90"
            style={{ borderColor: `${festival.accent}66`, color: festival.accent }}
          >
            {festival.message}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        aria-label={`${festival.name} — click for a small surprise`}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-sm shadow-lg transition-colors duration-300 cursor-pointer bg-gray-900/80 hover:bg-gray-800/80"
        style={{ borderColor: `${festival.accent}66` }}
      >
        <span className="text-base leading-none" aria-hidden="true">
          {festival.emoji}
        </span>
        <span
          className="text-sm font-mono font-semibold"
          style={{ color: festival.accent }}
        >
          {festival.name}
        </span>
      </motion.button>
    </motion.div>
  );
}

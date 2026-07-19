"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiHeart, FiEye } from "react-icons/fi";
import {
  getLoveCountServerAction,
  addLoveServerAction,
} from "@/app/api/loveActions";
import {
  getViewsServerAction,
  setViewsServerAction,
} from "@/app/api/viewsActions";

let preloadedAudio: HTMLAudioElement | null = null;

if (typeof Audio !== "undefined") {
  preloadedAudio = new Audio("/sounds/song1.mp3");
  preloadedAudio.volume = 0.75;
  preloadedAudio.preload = "auto";
  preloadedAudio.load();
}

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`;

export function FloatingLove() {
  const [views, setViews] = useState(0);
  const [love, setLove] = useState(0);
  const [hasLoved, setHasLoved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasLoved(localStorage.getItem("hasLoved") === "true");

    async function fetchCounts() {
      try {
        const [viewRes, loveRes] = await Promise.all([
          getViewsServerAction(),
          getLoveCountServerAction(),
        ]);
        setViews(viewRes.views || 0);
        setLove(loveRes.count || 0);

        const viewed = localStorage.getItem("uniqueUserViewed");
        if (!viewed) {
          await setViewsServerAction();
          localStorage.setItem("uniqueUserViewed", "true");
        }
      } catch {
        // counts stay at 0 on failure
      }
    }
    fetchCounts();
  }, []);

  const celebrate = async () => {
    try {
      const { default: confetti } = await import("canvas-confetti");
      preloadedAudio?.play().catch(() => {});

      const defaults = {
        spread: 70,
        startVelocity: 45,
        gravity: 0.9,
        scalar: 1.1,
        ticks: 100,
        colors: ["#ff4d6d", "#00bbf9", "#38bdf8", "#a855f7", "#f472b6"],
      };

      const shoot = () =>
        confetti({ ...defaults, particleCount: 45, origin: { x: 0.9, y: 0.85 } });

      shoot();
      [200, 400, 600, 800].forEach((t) => setTimeout(shoot, t));
    } catch {
      // confetti is non-critical
    }
  };

  const handleLoveClick = async () => {
    if (hasLoved) return;

    celebrate();
    setHasLoved(true);
    setLove((prev) => prev + 1);
    localStorage.setItem("hasLoved", "true");

    try {
      const res = await addLoveServerAction();
      setLove(res.count);
    } catch {
      // love count stays optimistically incremented
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1, ease: "easeOut" }}
      className="fixed bottom-24 right-4 md:right-6 z-40 flex flex-col items-center gap-1.5"
    >
      <motion.button
        whileHover={hasLoved ? undefined : { scale: 1.08 }}
        whileTap={hasLoved ? undefined : { scale: 0.95 }}
        onClick={handleLoveClick}
        aria-label={
          hasLoved
            ? `You already loved this — ${love} loves`
            : `Give love — ${love} loves so far`
        }
        aria-pressed={hasLoved}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-sm shadow-lg transition-colors duration-300 ${
          hasLoved
            ? "cursor-default border-red-500/60 bg-red-950/60 text-red-400"
            : "cursor-pointer border-pink-400/40 bg-gray-900/80 text-pink-400 hover:border-pink-400/80 hover:bg-gray-800/80"
        }`}
      >
        <FiHeart
          className={`w-4 h-4 ${hasLoved ? "fill-red-500 text-red-500" : ""}`}
        />
        <span className="text-sm font-mono font-semibold">
          {formatCount(love)}
        </span>
      </motion.button>

      <div
        className="flex items-center gap-1 text-[11px] font-mono text-gray-500"
        title={`${views} unique visitors`}
      >
        <FiEye className="w-3 h-3" />
        {formatCount(views)}
      </div>
    </motion.div>
  );
}

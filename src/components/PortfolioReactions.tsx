"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

// The pill stays hidden over the hero (where it used to cover text on mobile).
const SHOW_AFTER_PX = 500;
// How long the "Like this portfolio?" label stays expanded on first appearance.
const LABEL_MS = 4000;

/**
 * Portfolio-level love + visitor count. Renders two views over shared state:
 * an end-of-page card (inline, where this component is placed) and a floating
 * pill that appears once the visitor scrolls past the hero and hides while
 * the card itself is on screen.
 */
export function PortfolioReactions() {
  const [views, setViews] = useState(0);
  const [love, setLove] = useState(0);
  const [hasLoved, setHasLoved] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [pastHero, setPastHero] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);
  const labelShown = useRef(false);
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

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

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCardVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pillVisible = pastHero && !cardVisible;

  // Expand the label once, the first time the pill appears, for visitors who
  // haven't loved yet — a nudge, not a nag.
  useEffect(() => {
    if (!pillVisible || hasLoved || labelShown.current) return;
    labelShown.current = true;
    setShowLabel(true);
    const t = setTimeout(() => setShowLabel(false), LABEL_MS);
    return () => clearTimeout(t);
  }, [pillVisible, hasLoved]);

  const celebrate = async (originX: number, originY: number) => {
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
        disableForReducedMotion: true,
      };

      const shoot = () =>
        confetti({ ...defaults, particleCount: 45, origin: { x: originX, y: originY } });

      shoot();
      [200, 400, 600, 800].forEach((t) => setTimeout(shoot, t));
    } catch {
      // confetti is non-critical
    }
  };

  const handleLoveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasLoved) return;

    const rect = e.currentTarget.getBoundingClientRect();
    celebrate(
      (rect.left + rect.width / 2) / window.innerWidth,
      (rect.top + rect.height / 2) / window.innerHeight
    );
    setHasLoved(true);
    setShowLabel(false);
    setLove((prev) => prev + 1);
    setBurstKey((k) => k + 1);
    localStorage.setItem("hasLoved", "true");

    try {
      const res = await addLoveServerAction();
      setLove(res.count);
    } catch {
      // love count stays optimistically incremented
    }
  };

  const heartPop = {
    initial: burstKey && !reduceMotion ? { scale: 0.5 } : false,
    animate: { scale: 1 },
    transition: { type: "spring" as const, stiffness: 500, damping: 10 },
  };

  return (
    <>
      {/* End-of-page card */}
      <section
        ref={cardRef}
        aria-label="Portfolio reactions"
        className="mt-16 flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-950/20 via-gray-900/60 to-gray-950 text-center sm:text-left"
      >
        <button
          type="button"
          onClick={handleLoveClick}
          disabled={hasLoved}
          aria-pressed={hasLoved}
          aria-label={hasLoved ? `You loved this portfolio · ${love} loves` : `Love this portfolio · ${love} loves`}
          className={`group shrink-0 inline-flex items-center justify-center w-20 h-20 rounded-full border-2 transition-colors ${
            hasLoved
              ? "cursor-default border-red-500/70 bg-red-950/50"
              : "cursor-pointer border-pink-400/50 bg-gray-900 hover:border-pink-400 hover:bg-pink-950/40"
          }`}
        >
          <motion.span key={burstKey} {...heartPop} className="inline-flex">
            <FiHeart
              className={`w-9 h-9 transition-colors ${
                hasLoved ? "fill-red-500 text-red-500" : "text-pink-400"
              }`}
            />
          </motion.span>
        </button>

        <div className="min-w-0">
          <p className="text-xl font-semibold text-white">
            {hasLoved ? "Thank you — that made my day ❤️" : "Enjoyed looking around?"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {hasLoved
              ? "If you're hiring or want to chat, the contact form is right above."
              : "Leave a heart — it's anonymous and takes one tap."}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-5 mt-3 text-sm font-mono text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <FiHeart className="w-4 h-4 text-pink-400" aria-hidden="true" />
              <span className="text-gray-200">{formatCount(love)}</span>
              {love === 1 ? "love" : "loves"}
            </span>
            <span className="inline-flex items-center gap-1.5" title={`${views} unique visitors`}>
              <FiEye className="w-4 h-4" aria-hidden="true" />
              <span className="text-gray-200">{formatCount(views)}</span>
              visitors
            </span>
          </div>
        </div>
      </section>

      {/* Floating pill */}
      <AnimatePresence>
        {pillVisible && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-24 right-4 md:right-6 z-40"
          >
            <motion.button
              type="button"
              layout={!reduceMotion}
              onClick={handleLoveClick}
              onMouseEnter={() => !hasLoved && setShowLabel(true)}
              onMouseLeave={() => setShowLabel(false)}
              whileTap={hasLoved || reduceMotion ? undefined : { scale: 0.95 }}
              aria-pressed={hasLoved}
              aria-label={hasLoved ? `You loved this portfolio · ${love} loves` : `Love this portfolio · ${love} loves`}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-md shadow-lg shadow-black/40 font-mono text-sm transition-colors ${
                hasLoved
                  ? "cursor-default border-red-500/60 bg-red-950/70 text-red-400"
                  : "cursor-pointer border-pink-400/50 bg-gray-950/85 text-pink-400 hover:border-pink-400"
              }`}
            >
              <motion.span key={burstKey} {...heartPop} className="inline-flex">
                <FiHeart className={`w-4 h-4 ${hasLoved ? "fill-red-500 text-red-500" : ""}`} />
              </motion.span>
              <AnimatePresence initial={false}>
                {showLabel && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    // Desktop only: on phones the expanded pill runs into the festival badge.
                    className="hidden sm:inline-block overflow-hidden whitespace-nowrap text-gray-200"
                  >
                    Like this portfolio?
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="font-semibold">{formatCount(love)}</span>
              <span className="w-px h-3.5 bg-gray-700" aria-hidden="true" />
              <span className="inline-flex items-center gap-1 text-xs text-gray-500" title={`${views} unique visitors`}>
                <FiEye className="w-3.5 h-3.5" aria-hidden="true" />
                {formatCount(views)}
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

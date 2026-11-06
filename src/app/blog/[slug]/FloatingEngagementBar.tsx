"use client";

import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiHeart, FiEye, FiMessageSquare, FiShare2, FiCheck } from "react-icons/fi";
import { LikeBurst } from "./LikeBurst";

const SHOW_AFTER_PX = 400;

type Props = {
  likeCount: number;
  hasLiked: boolean;
  burstKey: number;
  viewCount: number;
  commentCount: number;
  onLike: () => void;
  formatCount: (n: number) => string;
  /** The end-of-article engagement section; the bar hides while it's on screen. */
  sectionRef: RefObject<HTMLElement | null>;
};

/**
 * Medium-style reaction bar: fades in once the reader is past the header and
 * stays pinned to the bottom of the viewport while they read, so liking or
 * sharing never requires scrolling to the end of the post.
 */
export default function FloatingEngagementBar({
  likeCount,
  hasLiked,
  burstKey,
  viewCount,
  commentCount,
  onLike,
  formatCount,
  sectionRef,
}: Props) {
  const [pastHeader, setPastHeader] = useState(false);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setPastHeader(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSectionVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionRef]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {
        // user dismissed the share sheet
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked — nothing useful to do
    }
  };

  const scrollToComments = () => {
    document
      .getElementById("comments")
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  };

  const visible = pastHeader && !sectionVisible;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
        >
          <div
            role="toolbar"
            aria-label="Post reactions"
            className="flex items-center gap-1 px-2 py-1.5 rounded-full border border-gray-700/80 bg-gray-950/85 backdrop-blur-md shadow-lg shadow-black/40 font-mono text-sm"
          >
            <button
              type="button"
              onClick={onLike}
              disabled={hasLiked}
              aria-pressed={hasLiked}
              aria-label={hasLiked ? `Liked · ${likeCount} likes` : `Like this post · ${likeCount} likes`}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                hasLiked
                  ? "text-red-400 cursor-default"
                  : "text-gray-300 hover:text-pink-400 hover:bg-gray-800/80 cursor-pointer"
              }`}
            >
              <span className="relative inline-flex">
                <motion.span
                  key={burstKey}
                  initial={burstKey && !reduceMotion ? { scale: 0.6 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                  className="inline-flex"
                >
                  <FiHeart className={`w-4 h-4 ${hasLiked ? "fill-red-500 text-red-500" : ""}`} />
                </motion.span>
                <LikeBurst burstKey={burstKey} />
              </span>
              {formatCount(likeCount)}
            </button>

            <span className="w-px h-4 bg-gray-800" aria-hidden="true" />

            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-gray-500"
              title={`${viewCount} views`}
            >
              <FiEye className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Views:</span>
              {formatCount(viewCount)}
            </span>

            <button
              type="button"
              onClick={scrollToComments}
              aria-label={`Jump to comments · ${commentCount}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-gray-300 hover:text-indigo-300 hover:bg-gray-800/80 transition-colors cursor-pointer"
            >
              <FiMessageSquare className="w-4 h-4" />
              {formatCount(commentCount)}
            </button>

            <span className="w-px h-4 bg-gray-800" aria-hidden="true" />

            <button
              type="button"
              onClick={handleShare}
              aria-label={copied ? "Link copied" : "Share this post"}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-gray-300 hover:text-white hover:bg-gray-800/80 transition-colors cursor-pointer"
            >
              {copied ? <FiCheck className="w-4 h-4 text-emerald-400" /> : <FiShare2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

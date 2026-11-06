"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiHeart, FiMessageSquare, FiEye } from "react-icons/fi";
import FloatingEngagementBar from "./FloatingEngagementBar";
import { LikeBurst } from "./LikeBurst";
import {
  getBlogLikeServerAction,
  addBlogLikeServerAction,
  getBlogViewsServerAction,
  addBlogViewServerAction,
  getBlogCommentsServerAction,
  addBlogCommentServerAction,
  type BlogCommentDTO,
} from "@/app/api/blogEngagementActions";

const formatCount = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k` : `${n}`;

const COMMENT_COOLDOWN_MS = 30_000;

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogEngagement({ slug }: { slug: string }) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [comments, setComments] = useState<BlogCommentDTO[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // Bumped on each like so the heart pop + burst animations replay.
  const [burstKey, setBurstKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasLiked(localStorage.getItem(`liked:${slug}`) === "true");

    (async () => {
      try {
        const [likeRes, viewRes, commentsRes] = await Promise.all([
          getBlogLikeServerAction(slug),
          getBlogViewsServerAction(slug),
          getBlogCommentsServerAction(slug),
        ]);
        setLikeCount(likeRes.count);
        setViewCount(viewRes.views);
        setComments(commentsRes.comments);

        const viewedKey = `viewed:${slug}`;
        if (!localStorage.getItem(viewedKey)) {
          const bumped = await addBlogViewServerAction(slug);
          setViewCount(bumped.views);
          localStorage.setItem(viewedKey, "true");
        }
      } catch {
        // stay at defaults on failure
      }
    })();
  }, [slug]);

  const handleLike = () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikeCount((c) => c + 1);
    setBurstKey((k) => k + 1);
    localStorage.setItem(`liked:${slug}`, "true");

    startTransition(async () => {
      try {
        const res = await addBlogLikeServerAction(slug);
        setLikeCount(res.count);
      } catch {
        // keep optimistic count on failure
      }
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage) {
      setError("Add your name and a comment first.");
      return;
    }

    const lastCommentAt = Number(localStorage.getItem("lastCommentAt") || 0);
    const remaining = COMMENT_COOLDOWN_MS - (Date.now() - lastCommentAt);
    if (remaining > 0) {
      setError(
        `You just posted a comment — wait ${Math.ceil(remaining / 1000)}s before posting another.`
      );
      return;
    }

    startTransition(async () => {
      try {
        const res = await addBlogCommentServerAction(
          slug,
          trimmedName,
          trimmedMessage,
          website
        );
        if (!res.success) {
          setError(res.error ?? "Couldn't post that comment. Try again in a moment.");
          return;
        }
        if (res.comment) {
          setComments((prev) => [res.comment as BlogCommentDTO, ...prev]);
          localStorage.setItem("lastCommentAt", String(Date.now()));
        }
        setName("");
        setMessage("");
      } catch {
        setError("Couldn't post that comment. Try again in a moment.");
      }
    });
  };

  return (
    <section ref={sectionRef} className="mt-14 pt-8 border-t border-gray-800">
      <FloatingEngagementBar
        likeCount={likeCount}
        hasLiked={hasLiked}
        burstKey={burstKey}
        viewCount={viewCount}
        commentCount={comments.length}
        onLike={handleLike}
        formatCount={formatCount}
        sectionRef={sectionRef}
      />

      {/* End-of-article reaction card */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-6 rounded-lg border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950">
        <button
          type="button"
          onClick={handleLike}
          disabled={hasLiked}
          aria-pressed={hasLiked}
          aria-label={hasLiked ? "You liked this post" : "Like this post"}
          className={`group relative shrink-0 self-start sm:self-auto inline-flex items-center justify-center w-16 h-16 rounded-full border-2 transition-colors ${
            hasLiked
              ? "cursor-default border-red-500/70 bg-red-950/50"
              : "cursor-pointer border-gray-700 bg-gray-900 hover:border-pink-400 hover:bg-pink-950/30"
          }`}
        >
          <motion.span
            key={burstKey}
            initial={burstKey && !reduceMotion ? { scale: 0.5 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 10 }}
            className="inline-flex"
          >
            <FiHeart
              className={`w-7 h-7 transition-colors ${
                hasLiked ? "fill-red-500 text-red-500" : "text-gray-300 group-hover:text-pink-400"
              }`}
            />
          </motion.span>
          <LikeBurst burstKey={burstKey} />
        </button>

        <div className="min-w-0">
          <p className="text-base font-semibold text-white">
            {hasLiked ? "Thanks for the love ❤️" : "Found this useful?"}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">
            {hasLiked
              ? "It genuinely helps me decide what to write next."
              : "Tap the heart — it tells me what to write more of."}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs font-mono text-gray-500">
            <span>
              <span className="text-gray-300">{formatCount(likeCount)}</span>{" "}
              {likeCount === 1 ? "like" : "likes"}
            </span>
            <span className="inline-flex items-center gap-1" title={`${viewCount} views`}>
              <FiEye className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-gray-300">{formatCount(viewCount)}</span> views
            </span>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div id="comments" className="mt-10 scroll-mt-24">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white mb-5">
          <FiMessageSquare className="text-gray-400" />
          Comments {comments.length > 0 && `(${comments.length})`}
        </h2>

        <form onSubmit={handleSubmit} className="mb-8 space-y-3">
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/60"
          />
          <textarea
            placeholder="Leave a comment…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full bg-gray-900 border border-gray-800 rounded-md px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/60 resize-none"
          />
          {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-mono text-white transition-colors"
          >
            {isPending ? "Posting…" : "Post comment"}
          </button>
        </form>

        <ul className="space-y-5">
          {comments.map((c) => (
            <li key={c.id} className="border-b border-gray-900 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-200">
                  {c.name}
                </span>
                <span className="text-xs font-mono text-gray-600">
                  {timeAgo(c.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                {c.message}
              </p>
            </li>
          ))}
          {comments.length === 0 && (
            <p className="text-sm text-gray-600 font-mono">
              No comments yet — be the first.
            </p>
          )}
        </ul>
      </div>
    </section>
  );
}

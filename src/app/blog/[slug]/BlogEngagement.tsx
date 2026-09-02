"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { FiHeart, FiMessageSquare } from "react-icons/fi";
import {
  getBlogLikeServerAction,
  addBlogLikeServerAction,
  getBlogCommentsServerAction,
  addBlogCommentServerAction,
  type BlogCommentDTO,
} from "@/app/api/blogEngagementActions";

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
  const [comments, setComments] = useState<BlogCommentDTO[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasLiked(localStorage.getItem(`liked:${slug}`) === "true");

    (async () => {
      try {
        const [likeRes, commentsRes] = await Promise.all([
          getBlogLikeServerAction(slug),
          getBlogCommentsServerAction(slug),
        ]);
        setLikeCount(likeRes.count);
        setComments(commentsRes.comments);
      } catch {
        // stay at defaults on failure
      }
    })();
  }, [slug]);

  const handleLike = () => {
    if (hasLiked) return;
    setHasLiked(true);
    setLikeCount((c) => c + 1);
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

    startTransition(async () => {
      try {
        const res = await addBlogCommentServerAction(
          slug,
          trimmedName,
          trimmedMessage,
          website
        );
        if (res.comment) {
          setComments((prev) => [res.comment as BlogCommentDTO, ...prev]);
        }
        setName("");
        setMessage("");
      } catch {
        setError("Couldn't post that comment. Try again in a moment.");
      }
    });
  };

  return (
    <section className="mt-14 pt-8 border-t border-gray-800">
      {/* Like button */}
      <button
        type="button"
        onClick={handleLike}
        disabled={hasLiked}
        aria-pressed={hasLiked}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-mono transition-colors ${
          hasLiked
            ? "cursor-default border-red-500/60 bg-red-950/40 text-red-400"
            : "cursor-pointer border-gray-800 bg-gray-900 text-gray-300 hover:border-pink-400/60 hover:text-pink-400"
        }`}
      >
        <FiHeart className={hasLiked ? "fill-red-500 text-red-500" : ""} />
        {likeCount} {likeCount === 1 ? "like" : "likes"}
      </button>

      {/* Comments */}
      <div className="mt-10">
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

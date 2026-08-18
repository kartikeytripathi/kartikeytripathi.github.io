import Image from "next/image";
import { FiYoutube, FiBookOpen, FiPlay, FiArrowUpRight } from "react-icons/fi";
import { videos, blogPosts } from "@/config/blog";

const latestVideo = videos[0];
const latestPost = blogPosts[0];

export function LatestStrip() {
  return (
    <section aria-label="Latest content" className="mb-16">
      {/* Label */}
      <div className="flex items-center gap-2 mb-5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400/70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-muted-foreground">
          Latest
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Latest video */}
        {latestVideo && (
          <a
            href={latestVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch latest video: ${latestVideo.title}`}
            className="group flex gap-4 rounded-xl border border-red-500/30 p-3 transition-all duration-300 hover:border-red-500/60 hover:bg-red-500/5"
          >
            <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-gray-900">
              <Image
                src={`https://i.ytimg.com/vi/${latestVideo.videoId}/hqdefault.jpg`}
                alt={latestVideo.title}
                fill
                sizes="128px"
                className="object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 shadow-lg transition-transform group-hover:scale-110">
                  <FiPlay className="ml-0.5 h-4 w-4 text-white" fill="currentColor" />
                </span>
              </span>
            </div>

            <div className="flex min-w-0 flex-col justify-center">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-red-400">
                <FiYoutube className="h-3.5 w-3.5" /> New video
              </span>
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">
                {latestVideo.title}
              </h3>
              <span className="mt-1 text-xs font-mono text-muted-foreground">
                {latestVideo.date}
              </span>
            </div>
          </a>
        )}

        {/* Latest blog post */}
        {latestPost && (
          <a
            href={
              latestPost.externalUrl ??
              `https://blogs.kartikeytripathi.in/${latestPost.slug}`
            }
            target={latestPost.type === "resource" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            aria-label={`Read latest post: ${latestPost.title}`}
            className="group flex gap-4 rounded-xl border border-purple-500/30 p-3 transition-all duration-300 hover:border-purple-500/60 hover:bg-purple-500/5"
          >
            <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-lg bg-gray-900">
              {latestPost.thumbnail ? (
                <Image
                  src={latestPost.thumbnail}
                  alt={latestPost.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-950/60 to-purple-950/60 p-2">
                  <FiBookOpen className="h-6 w-6 text-purple-300/70" />
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-col justify-center">
              <span className="mb-1 flex items-center gap-1.5 text-xs font-mono uppercase tracking-wide text-purple-400">
                <FiBookOpen className="h-3.5 w-3.5" /> New post
              </span>
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white">
                {latestPost.title}
              </h3>
              <span className="mt-1 flex items-center gap-1 text-xs font-mono text-muted-foreground">
                {latestPost.date}
                <FiArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}

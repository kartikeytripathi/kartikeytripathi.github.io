"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiExternalLink, FiYoutube, FiPlay } from "react-icons/fi";
import { videos } from "@/config/blog";

function VideoEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="absolute inset-0 w-full h-full group cursor-pointer"
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={title}
        fill
        className="object-cover"
      />
      <span className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-16 h-16 rounded-full bg-red-600/90 group-hover:bg-red-500 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-red-900/50">
          <FiPlay className="w-7 h-7 text-white ml-1" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}

export function Videos() {
  return (
    <div className="mb-16">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="p-3 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-xl border border-red-500/30"
          >
            <FiYoutube className="w-6 h-6 text-red-400" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-red-100 to-rose-300 bg-clip-text text-transparent">
            Videos
          </h2>
        </div>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
        />
      </motion.div>

      {/* Video Cards */}
      <div className="space-y-8">
        {videos.map((video, index) => (
          <motion.div
            key={video.videoId}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden border border-red-500/30 md:grid md:grid-cols-5"
          >
            {/* Embed */}
            <div className="relative aspect-video bg-gray-900 md:col-span-3">
              <VideoEmbed videoId={video.videoId} title={video.title} />
            </div>

            {/* Content */}
            <div className="p-6 md:col-span-2 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">
                  {video.date}
                </span>
                {video.publishedOn && (
                  <>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs font-mono text-orange-400">
                      {video.publishedOn}
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                {video.title}
              </h3>

              <p className="text-gray-300 mb-4 leading-relaxed text-sm line-clamp-3">
                {video.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {video.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Watch on YouTube"
                  className="text-red-400 hover:text-red-300 transition-colors shrink-0 ml-2"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

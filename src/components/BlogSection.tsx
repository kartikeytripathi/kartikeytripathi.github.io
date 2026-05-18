"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiExternalLink, FiBookOpen } from "react-icons/fi";
import { blogPosts } from "@/config/blog";

export function BlogSection() {
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
            className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30"
          >
            <FiBookOpen className="w-6 h-6 text-purple-400" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-100 to-pink-300 bg-clip-text text-transparent">
            Blog
          </h2>
        </div>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"
        />
      </motion.div>

      {/* Blog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post, index) => (
          <motion.a
            key={post.slug}
            href={post.externalUrl ?? `https://blogs.kartikeytripathi.in/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.01, y: -2 }}
            className="rounded-xl overflow-hidden transition-all duration-500 ease-out border border-purple-500/30 block"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gray-900 overflow-hidden">
              {post.thumbnail ? (
                <Image
                  src={post.thumbnail}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-950/60 to-purple-950/60 p-6">
                  <p className="text-sm font-mono text-gray-300 text-center line-clamp-3 leading-relaxed">
                    {post.title}
                  </p>
                </div>
              )}
              <span className="absolute top-2 left-2 text-xs font-mono px-2 py-0.5 rounded-sm bg-black/70 text-gray-300 border border-gray-700">
                {post.type === "video" ? "▶ VIDEO" : "✦ ARTICLE"}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">
                  {post.date}
                </span>
                {post.publishedOn && (
                  <>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs font-mono text-orange-400">
                      {post.publishedOn}
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-lg font-bold text-white mb-2 leading-snug line-clamp-2">
                {post.title}
              </h3>

              <p className="text-gray-300 mb-4 leading-relaxed line-clamp-2 text-sm">
                {post.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-1.5 py-0.5 bg-gray-900 border border-gray-800 text-gray-400 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <FiExternalLink className="w-4 h-4 text-purple-400 shrink-0 ml-2" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {/* View all link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="mt-8 text-center"
      >
        <a
          href="https://blogs.kartikeytripathi.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-mono text-purple-400 hover:text-purple-300 transition-colors border border-purple-500/30 px-4 py-2 rounded-sm hover:border-purple-500/60"
        >
          <FiBookOpen className="w-4 h-4" />
          View all posts at blogs.kartikeytripathi.in
        </a>
      </motion.div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { FaGithub, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { heroSection } from "@/config/data";

function getSocialIcon(title: string) {
  switch (title) {
    case "GitHub":
      return <FaGithub className="w-8 h-8 text-gray-200 hover:text-gray-500" />;
    case "Twitter":
      return (
        <FaSquareXTwitter className="w-8 h-8 text-gray-200 hover:text-gray-500" />
      );
    case "Instagram":
      return (
        <FaInstagram className="w-8 h-8 text-pink-500 hover:text-pink-700" />
      );
    default:
      return (
        <FaLinkedinIn className="w-8 h-8 text-blue-500 hover:text-blue-700" />
      );
  }
}

export function HeroSection() {
  const { avatar, name, title, description, location, email } =
    heroSection.personalInfo;

  return (
    <>
      {/* 🔥 Preload avatar for instant render */}
      <link rel="preload" href={avatar} as="image" type="image/webp" />

      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16">
        {/* Left side - Avatar + socials */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center lg:items-start"
        >
          {/* Optimized avatar */}
          <div className="relative w-40 h-40 mb-6 rounded-full ring-2 ring-gray-800 overflow-hidden bg-gray-900/50">
            <Image
              src={avatar}
              alt={name}
              fill
              priority
              placeholder="blur"
              blurDataURL="/blur-placeholder.webp"
              className="object-cover"
            />
          </div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="flex items-center gap-2 text-sm text-gray-400 mb-4"
          >
            <FiMapPin className="w-4 h-4" />
            {location}
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="flex w-full items-center gap-4 justify-between"
          >
            {heroSection.socialLinks.map(({ title, url }, index) => (
              <motion.a
                key={title}
                title={title}
                initial={{ x: 5, scale: 0.8 }}
                animate={{ x: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getSocialIcon(title)}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - Text info */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          {/* CTA button */}
          <div className="flex justify-center lg:justify-start items-center gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <a
                className="flex items-center border border-blue-700/50 text-blue-300 hover:bg-blue-900/30 transition-all duration-300 py-2 px-4 rounded-sm"
                href="https://topmate.io/kartikeytripathi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiCalendar className="w-4 h-4 mr-2" />
                <span>Schedule a call</span>
              </a>
            </motion.div>
          </div>

          {/* Name & Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            className="text-4xl lg:text-6xl font-bold mb-3 tracking-tight"
          >
            {name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            className="text-xl text-gray-400 mb-5"
          >
            {title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            className="text-gray-300 leading-relaxed text-lg max-w-2xl"
          >
            {description}
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}

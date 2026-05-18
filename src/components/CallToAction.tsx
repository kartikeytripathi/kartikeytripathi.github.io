"use client";

import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import { FiMail } from "react-icons/fi";

export function CallToAction() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="text-center pb-16 bg-gray-900/20 rounded-2xl"
    >
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <div className="flex items-center justify-center gap-4 mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
            className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30"
          >
            <FaRocket className="w-6 h-6 text-blue-400" />
          </motion.div>

          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Let&apos;s Build Something Amazing
          </h2>
        </div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent max-w-md mx-auto"
        />
      </motion.div>

      {/* SUBTEXT */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
      >
        Ready to bring your ideas to life? I&apos;m always excited to collaborate on
        innovative projects and help transform your vision into reality.
      </motion.p>

      {/* BUTTON GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto w-full">

        {[
          {
            href: "mailto:contact@kartikeytripathi.in",
            label: "contact@kartikeytripathi.in",
            icon: <FiMail className="w-5 h-5 text-blue-400" />
          },
          {
            href: "https://topmate.io/kartikeytripathi",
            label: "Source code on Topmate",
            icon: (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 4.5l7.5 7.5-7.5 7.5m7.5-7.5H4.5"
                />
              </svg>
            )
          }
        ].map((btn, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full"
          >
            <a
              href={btn.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 
                         border border-blue-700/50 text-blue-300 
                         hover:bg-blue-900/30 transition-all duration-300 
                         py-2 px-4 rounded-sm text-sm whitespace-normal text-center"
            >
              {btn.icon}
              <span>{btn.label}</span>
            </a>
          </motion.div>
        ))}

      </div>
    </motion.div>
  );
}

"use client"

import { useState } from "react"
import { workExperience } from "@/config/data"
import { AnimatePresence, motion } from "framer-motion"
import { FiBriefcase } from "react-icons/fi"

export function WorkExperience() {
  const [active, setActive] = useState(0)
  const job = workExperience[active]

  return (
    <div className="mb-16">
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
            className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30"
          >
            <FiBriefcase className="w-6 h-6 text-blue-400" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-300 bg-clip-text text-transparent">
            Professional Journey
          </h2>
        </div>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100%" }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row gap-6 md:gap-10"
      >
        {/* Tab list — horizontal scroll on mobile, vertical rail on desktop */}
        <div
          role="tablist"
          aria-label="Companies"
          className="flex md:flex-col overflow-x-auto md:overflow-visible shrink-0 border-b md:border-b-0 md:border-l border-gray-800"
        >
          {workExperience.map((item, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={active === index}
              onClick={() => setActive(index)}
              className={`px-4 py-3 text-sm font-mono text-left whitespace-nowrap transition-colors duration-300 border-b-2 md:border-b-0 md:border-l-2 -mb-px md:mb-0 md:-ml-px ${
                active === index
                  ? "text-blue-400 border-blue-400 bg-blue-500/10"
                  : "text-gray-500 border-transparent hover:text-gray-300 hover:bg-gray-900/50"
              }`}
            >
              {item.tabLabel}
            </button>
          ))}
        </div>

        {/* Active job panel */}
        <div className="min-h-[340px] flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              role="tabpanel"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-xl font-bold text-white">
                  {job.position}
                  <span className="text-blue-400"> @ {job.company}</span>
                </h3>
                <p className="text-gray-400 text-sm font-mono mt-1">
                  {job.period} · {job.location}
                </p>
              </div>

              <p className="text-gray-200">{job.shortDesc}</p>

              <ul className="space-y-2 pl-1">
                {job.bulletPoints.map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                    className="flex items-start gap-3 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 shrink-0" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

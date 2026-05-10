"use client"

import { certifications } from "@/config/data"
import { motion } from "framer-motion"
import { FaAws, FaCertificate, FaExternalLinkAlt } from "react-icons/fa"
import { SiOracle } from "react-icons/si"

function IssuerIcon({ issuer }: { issuer: string }) {
  if (issuer.toLowerCase().includes("oracle"))
    return <SiOracle className="w-5 h-5 text-red-500" />
  if (issuer.toLowerCase().includes("amazon") || issuer.toLowerCase().includes("aws"))
    return <FaAws className="w-5 h-5 text-orange-400" />
  return <FaCertificate className="w-5 h-5 text-blue-400" />
}

export function Certifications() {
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
            className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30"
          >
            <FaCertificate className="w-6 h-6 text-blue-400" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Achievements & Badges
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certifications.map((cert, index) => {
          const Card = (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="group flex items-start gap-4 p-5 bg-gray-900/30 hover:bg-gray-800/50 border border-blue-500/20 hover:border-blue-500/40 rounded-xl transition-all duration-300 cursor-pointer"
            >
              <div className="p-2 bg-gray-800/60 rounded-lg shrink-0 mt-0.5">
                <IssuerIcon issuer={cert.issuer} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-snug mb-1 group-hover:text-blue-200 transition-colors duration-300">
                  {cert.title}
                </p>
                <p className="text-gray-400 text-xs mb-2">{cert.issuer}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                  <span>Issued {cert.issued}</span>
                  {cert.expires && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span>Expires {cert.expires}</span>
                    </>
                  )}
                </div>
              </div>

              {cert.url && (
                <FaExternalLinkAlt className="w-3 h-3 text-gray-600 group-hover:text-blue-400 shrink-0 mt-1 transition-colors duration-300" />
              )}
            </motion.div>
          )

          return cert.url ? (
            <a key={index} href={cert.url} target="_blank" rel="noopener noreferrer">
              {Card}
            </a>
          ) : (
            <div key={index}>{Card}</div>
          )
        })}
      </div>
    </div>
  )
}

"use client";

import { techStack } from "@/config/data";
import { motion } from "framer-motion";
import { FaReact } from "react-icons/fa";

const categories = [
  { title: "Cloud & Containers", types: ["Cloud & Containers"] },
  { title: "DevOps & IaC", types: ["DevOps & IaC"] },
  { title: "Databases", types: ["Databases"] },
  { title: "Languages & Web", types: ["Languages", "Web"] },
];

export function TechnicalSkills() {
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
            <FaReact className="w-6 h-6 text-blue-400" />
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            Tech Arsenal
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category, catIndex) => {
          const skills = techStack.filter((s) => category.types.includes(s.type));
          return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: catIndex * 0.1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="rounded-xl border border-blue-500/30 bg-gray-900/30 p-5"
            >
              <h3 className="text-sm font-mono font-semibold text-blue-400 uppercase tracking-wider mb-4 pb-3 border-b border-gray-800">
                {category.title}
              </h3>

              <div className="space-y-3">
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: catIndex * 0.1 + index * 0.05,
                        ease: "easeOut",
                      }}
                      viewport={{ once: true }}
                      whileHover={{ x: 4 }}
                      className="group flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-800/50 transition-colors duration-300"
                    >
                      <IconComponent
                        className={`w-6 h-6 shrink-0 ${skill.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                        {skill.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

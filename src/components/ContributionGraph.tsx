"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FiGithub, FiUsers, FiUserCheck } from "react-icons/fi";
import { githubSection } from "@/config/data";

// Lazy-load GitHubCalendar
const GitHubCalendar = dynamic(() => import("react-github-calendar"), {
  ssr: false,
  loading: () => (
    <div className="text-center text-gray-400 py-10">Loading graph...</div>
  ),
});

const githubTheme = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export default function ContributionGraph() {
  const username = githubSection.username;
  const { title } = githubSection;

  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({ followers: 0, following: 0 });

  const { theme, systemTheme } = useTheme();
  const scheme =
    theme === "light" ? "light" : theme === "dark" ? "dark" : systemTheme;

  const graphRef = useRef<HTMLDivElement>(null);

  // Auto scroll
  useEffect(() => {
    const scrollToRight = () => {
      graphRef.current?.scrollTo({
        left: graphRef.current.scrollWidth,
        behavior: "smooth",
      });
    };
    const timer = setTimeout(scrollToRight, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Delay theme until client is mounted to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Fetch profile stats
  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
          next: { revalidate: 3600 },
        });
        const data = await res.json();
        setStats({ followers: data.followers, following: data.following });
      } catch {
        // stats stay at 0 on failure
      }
    }
    fetchGitHubData();
  }, [username]);

  const githubInfo = [
    { icon: <FiUsers />, label: "Followers", value: stats.followers },
    { icon: <FiUserCheck />, label: "Following", value: stats.following },
  ];

  return (
    <div className="mb-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30">
            <FiGithub className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      </motion.div>

      {/* Graph */}
      <motion.div
        ref={graphRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="
          w-full md:w-[90%] lg:w-[80%] xl:w-[78%]
          mx-auto overflow-x-auto border border-blue-500/30
          rounded-xl p-3 md:p-5 dark:bg-primary-bg bg-secondary-bg
          shadow-md scrollbar-none
        "
      >
        <GitHubCalendar
          username={username}
          colorScheme={mounted ? scheme : undefined}
          theme={{ light: githubTheme.light, dark: githubTheme.dark }}
          blockSize={11}
          blockMargin={3}
          fontSize={13}
        />
      </motion.div>

      {/* Info Cards */}
      <div
        className="
          grid grid-cols-2 gap-4
          w-full md:w-[90%] lg:w-[80%] xl:w-[78%]
          mx-auto mt-6
        "
      >
        {githubInfo.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-900/30 border border-blue-500/30 hover:bg-gray-800/50 transition-all duration-300 flex flex-col items-center justify-center
              p-3 rounded-lg text-center h-[70px] md:h-[80px] lg:h-[85px]
              w-[90%] md:w-[85%] lg:w-[80%] mx-auto"
          >
            <div className="mb-1 text-blue-400">{item.icon}</div>
            <p className="text-[11px] md:text-[12px] font-medium text-gray-400 leading-tight">
              {item.label}
            </p>
            <p className="text-[13px] md:text-[14px] font-semibold text-white">
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  FiGithub,
  FiUsers,
  FiUserCheck,
  FiHeart,
  FiEye,
} from "react-icons/fi";
import { githubSection } from "@/config/data";

// Lazy-load GitHubCalendar
const GitHubCalendar = dynamic(() => import("react-github-calendar"), {
  ssr: false,
  loading: () => (
    <div className="text-center text-gray-400 py-10">Loading graph...</div>
  ),
});

// Server Actions
import {
  getLoveCountServerAction,
  addLoveServerAction,
} from "@/app/api/loveActions";
import {
  getViewsServerAction,
  setViewsServerAction,
} from "@/app/api/viewsActions";

// 🎵 Preload audio (TS FIX)
let preloadedAudio: HTMLAudioElement | null = null;

if (typeof Audio !== "undefined") {
  preloadedAudio = new Audio("/sounds/song1.mp3");
  preloadedAudio.volume = 0.75;
  preloadedAudio.preload = "auto";
  preloadedAudio.load();
}

const githubTheme = {
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

export default function ContributionGraph() {
  const username = githubSection.username;
  const { title } = githubSection;

  const [serverTheme, setServerTheme] = useState<"light" | "dark" | undefined>();
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [views, setViews] = useState(0);
  const [love, setLove] = useState(0);
  const [hasLoved, setHasLoved] = useState(false);

  const { theme, systemTheme } = useTheme();
  const scheme =
    theme === "light" ? "light" : theme === "dark" ? "dark" : systemTheme;

  const graphRef = useRef<HTMLDivElement>(null);

  // preload audio on mount
  useEffect(() => {
    preloadedAudio?.load();
  }, []);

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

  // Theme
  useEffect(() => {
    setServerTheme(scheme);
  }, [scheme]);

  // Fetch profile stats
  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
          next: { revalidate: 3600 },
        });
        const data = await res.json();
        setStats({ followers: data.followers, following: data.following });
      } catch (err) {
        console.error("GitHub API error:", err);
      }
    }
    fetchGitHubData();
  }, [username]);

  // Views + Love
  useEffect(() => {
    async function fetchCounts() {
      try {
        const [viewRes, loveRes] = await Promise.all([
          getViewsServerAction(),
          getLoveCountServerAction(),
        ]);
        setViews(viewRes.views || 0);
        setLove(loveRes.count || 0);

        const viewed = localStorage.getItem("uniqueUserViewed");
        if (!viewed) {
          await setViewsServerAction();
          localStorage.setItem("uniqueUserViewed", "true");
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    }
    fetchCounts();
  }, []);

  // 🎉 Confetti + instant audio
  const celebrate = async () => {
    try {
      const { default: confetti } = await import("canvas-confetti");

      // instant play
      preloadedAudio?.play().catch(() => {});

      const colors =
        scheme === "dark"
          ? ["#ff4d6d", "#00bbf9", "#38bdf8", "#a855f7", "#f472b6"]
          : ["#facc15", "#ef4444", "#3b82f6", "#10b981", "#a855f7"];

      const defaults = {
        spread: 70,
        startVelocity: 45,
        gravity: 0.9,
        scalar: 1.1,
        ticks: 100,
        colors,
      };

      const shoot = () => {
        confetti({
          ...defaults,
          particleCount: 45,
          origin: { x: 0.5, y: 0.5 },
        });
      };

      shoot();
      [200, 400, 600, 800].forEach((t) => setTimeout(shoot, t));
    } catch (e) {
      console.error("Confetti error:", e);
    }
  };

  // ❤️ Love click
  const handleLoveClick = async () => {
    if (hasLoved) return;

    celebrate();
    setHasLoved(true);
    setLove((prev) => prev + 1);
    localStorage.setItem("hasLoved", "true");

    try {
      const res = await addLoveServerAction();
      setLove(res.count);
    } catch (error) {
      console.error("Love count error:", error);
    }
  };

  const githubInfo = [
    { icon: <FiUsers />, label: "Followers", value: stats.followers },
    { icon: <FiUserCheck />, label: "Following", value: stats.following },
    { icon: <FiHeart />, label: "Love Count", value: love, isLove: true },
    { icon: <FiEye />, label: "Views", value: views },
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
          colorScheme={serverTheme}
          theme={{ light: githubTheme.light, dark: githubTheme.dark }}
          blockSize={11}
          blockMargin={3}
          fontSize={13}
        />
      </motion.div>

      {/* Info Cards */}
      <div
        className="
          grid grid-cols-2 md:grid-cols-4 gap-4 
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
            onClick={item.isLove ? handleLoveClick : undefined}
            {...(item.isLove && {
              role: "button",
              tabIndex: 0,
              "aria-label": hasLoved
                ? `You already loved this — ${love} loves`
                : `Give love — ${love} loves so far`,
              "aria-pressed": hasLoved,
              onKeyDown: (e: React.KeyboardEvent) => {
                if (e.key === "Enter" || e.key === " ") handleLoveClick();
              },
            })}
            className={`bg-gray-900/30 border border-blue-500/30 hover:bg-gray-800/50
              transition-all duration-300 flex flex-col items-center justify-center
              p-3 rounded-lg text-center h-[70px] md:h-[80px] lg:h-[85px]
              w-[90%] md:w-[85%] lg:w-[80%] mx-auto
              ${item.isLove ? "cursor-pointer hover:border-pink-400/60" : ""}`}
          >
            <div
              className={`mb-1 ${
                item.isLove
                  ? "text-pink-400 group-hover:text-pink-300"
                  : "text-blue-400"
              }`}
            >
              {item.icon}
            </div>
            <p className="text-[11px] md:text-[12px] font-medium text-gray-400 leading-tight">
              {item.label}
            </p>
            <p
              className={`text-[13px] md:text-[14px] font-semibold ${
                item.isLove ? "text-pink-400" : "text-white"
              }`}
            >
              {item.isLove ? `❤️ ${item.value}` : item.value}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

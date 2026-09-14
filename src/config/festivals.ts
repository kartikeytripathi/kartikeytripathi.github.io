export type Festival = {
  id: string;
  name: string;
  emoji: string;
  accent: string;
  message: string;
  /** Inclusive date range, IST (Asia/Kolkata), format YYYY-MM-DD. */
  start: string;
  end: string;
};

// Lunisolar festivals (Ganesh Chaturthi, Dussehra, Diwali) shift every year —
// this list needs a manual top-up each year, it isn't computed from a rule.
export const festivals: Festival[] = [
  {
    id: "ganesh-chaturthi-2026",
    name: "Ganesh Chaturthi",
    emoji: "🪔",
    accent: "#F97316",
    message: "Ganpati Bappa Morya!",
    start: "2026-09-14",
    end: "2026-09-23",
  },
  {
    id: "dussehra-2026",
    name: "Dussehra",
    emoji: "🏹",
    accent: "#DC2626",
    message: "Happy Dussehra — victory of good over evil.",
    start: "2026-10-18",
    end: "2026-10-20",
  },
  {
    id: "diwali-2026",
    name: "Diwali",
    emoji: "🪔",
    accent: "#F5C842",
    message: "Happy Diwali — may your builds always be green.",
    start: "2026-11-06",
    end: "2026-11-10",
  },
  {
    id: "christmas-2026",
    name: "Christmas",
    emoji: "🎄",
    accent: "#22C55E",
    message: "Merry Christmas!",
    start: "2026-12-20",
    end: "2026-12-26",
  },
];

export function getActiveFestival(now: Date = new Date()): Festival | null {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return festivals.find((f) => today >= f.start && today <= f.end) ?? null;
}

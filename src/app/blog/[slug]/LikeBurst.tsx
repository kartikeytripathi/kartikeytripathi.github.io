"use client";

import { motion, useReducedMotion } from "framer-motion";

const PARTICLES = 8;

/** A ring of small dots that flies out from the heart when a like lands. */
export function LikeBurst({ burstKey }: { burstKey: number }) {
  const reduceMotion = useReducedMotion();
  if (!burstKey || reduceMotion) return null;

  return (
    <span key={burstKey} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: PARTICLES }, (_, i) => {
        const angle = (i / PARTICLES) * Math.PI * 2;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 w-1 h-1 -ml-0.5 -mt-0.5 rounded-full bg-pink-400"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * 16,
              y: Math.sin(angle) * 16,
              opacity: 0,
              scale: 0.4,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        );
      })}
    </span>
  );
}

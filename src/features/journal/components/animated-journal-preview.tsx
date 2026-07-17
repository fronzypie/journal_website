"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { motionEase } from "@/lib/motion";

const lines = [
  "There is a part of the day that only becomes visible when I stop trying to optimize it.",
  "Tonight I want to remember the blue hour, the quiet cup, the sentence I almost missed.",
  "I felt most myself when I gave the moment more space than my plans.",
];

export function AnimatedJournalPreview() {
  const reducedMotion = useReducedMotion();

  return (
    <GlassPanel className="relative min-h-[34rem] overflow-hidden p-4 sm:p-6" variant="strong">
      {!reducedMotion ? (
        <>
          <motion.div
            animate={{ opacity: [0.28, 0.52, 0.28], scale: [1, 1.04, 1] }}
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue/20 blur-3xl"
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            animate={{ opacity: [0.18, 0.38, 0.18], y: [0, -14, 0] }}
            className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber/16 blur-3xl"
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-amber/16 blur-3xl" />
        </>
      )}

      <div className="relative flex h-full flex-col rounded-md border border-white/10 bg-ink/36 p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="ds-caption">Evening entry</p>
            <h3 className="mt-2 text-xl font-medium text-porcelain">
              The hour after noise
            </h3>
          </div>
          <div className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs text-muted">
            autosaved
          </div>
        </div>

        <div className="grid flex-1 gap-5 pt-6 lg:grid-cols-[0.74fr_0.26fr]">
          <div className="space-y-6">
            {lines.map((line, index) => (
              <motion.p
                animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                className="text-lg leading-9 text-muted-strong"
                initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                key={line}
                transition={{
                  delay: reducedMotion ? 0 : 0.18 + index * 0.16,
                  duration: reducedMotion ? 0 : 0.7,
                  ease: motionEase,
                }}
              >
                {line}
              </motion.p>
            ))}
            {reducedMotion ? (
              <div className="h-8 w-px bg-porcelain/70" />
            ) : (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                className="h-8 w-px bg-porcelain"
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </div>

          <div className="space-y-3">
            {["clarity", "soft", "private"].map((tag, index) => (
              <motion.div
                animate={reducedMotion ? { opacity: 1, x: 0 } : { opacity: 1, x: 0 }}
                className="rounded-md border border-white/10 bg-white/[0.055] px-3 py-3 text-sm text-muted-strong"
                initial={reducedMotion ? false : { opacity: 0, x: 16 }}
                key={tag}
                transition={{
                  delay: reducedMotion ? 0 : 0.45 + index * 0.1,
                  duration: reducedMotion ? 0 : 0.5,
                }}
              >
                {tag}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { reflectionPrompts } from "@/features/journal/data/journal-data";

const moods = ["Still", "Clear", "Tender"] as const;

export function HeroPromptCard() {
  const reducedMotion = useReducedMotion();
  const prompt = reflectionPrompts[1];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-full bg-amber/10 blur-3xl" />
      <motion.div
        animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <GlassPanel className="relative p-4 sm:p-5" variant="strong">
          <div className="rounded-lg border border-white/10 bg-ink/36 p-5">
            <div className="mb-10 flex items-center justify-between text-sm text-muted">
              <span>{prompt.label}</span>
              <span>11:42 PM</span>
            </div>
            <p className="ds-caption">Prompt</p>
            <p className="mt-3 text-2xl font-medium leading-tight text-porcelain sm:text-3xl">
              {prompt.prompt}
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {moods.map((mood, index) => (
                <motion.div
                  animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  className="rounded-md border border-white/10 bg-white/[0.055] p-3 text-sm text-muted-strong"
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  key={mood}
                  transition={{
                    delay: reducedMotion ? 0 : 0.35 + index * 0.08,
                    duration: 0.5,
                  }}
                >
                  {mood}
                </motion.div>
              ))}
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
}

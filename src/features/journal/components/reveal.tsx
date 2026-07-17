"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  getRevealState,
  getRevealTransition,
  viewportOnce,
} from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  delay?: number;
};

export function Reveal({ children, delay = 0 }: RevealProps) {
  const reducedMotion = useReducedMotion();
  const { hidden, visible } = getRevealState(Boolean(reducedMotion));

  return (
    <motion.div
      initial={hidden}
      transition={getRevealTransition(Boolean(reducedMotion), delay)}
      viewport={viewportOnce}
      whileInView={visible}
    >
      {children}
    </motion.div>
  );
}

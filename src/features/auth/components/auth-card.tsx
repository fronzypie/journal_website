"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GlassPanel } from "@/components/ui/glass-panel";
import { motionEase } from "@/lib/motion";

type AuthCardProps = {
  children: ReactNode;
  footer?: ReactNode;
  subtitle?: string;
  title: string;
};

export function AuthCard({ children, footer, subtitle, title }: AuthCardProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: 0, scale: 1 }}
      initial={
        reducedMotion
          ? false
          : { opacity: 0, y: 20, scale: 0.98 }
      }
      transition={{
        duration: reducedMotion ? 0 : 0.55,
        ease: motionEase,
      }}
    >
      <GlassPanel className="p-6 sm:p-8" variant="strong">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-porcelain sm:text-3xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="ds-text-body mt-2 text-sm">{subtitle}</p>
          ) : null}
        </div>
        {children}
        {footer ? (
          <div className="mt-6 border-t border-white/10 pt-6 text-center text-sm text-muted">
            {footer}
          </div>
        ) : null}
      </GlassPanel>
    </motion.div>
  );
}

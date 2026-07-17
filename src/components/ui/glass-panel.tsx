import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type GlassPanelVariant = "default" | "strong" | "quiet";

type GlassPanelProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "aside" | "section";
  children: ReactNode;
  variant?: GlassPanelVariant;
};

const variants: Record<GlassPanelVariant, string> = {
  default: "ds-surface",
  strong: "ds-surface-strong",
  quiet: "border border-white/8 bg-black/18",
};

export function GlassPanel({
  as: Component = "section",
  children,
  className,
  variant = "default",
  ...props
}: GlassPanelProps) {
  return (
    <Component
      className={cn("rounded-lg", variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

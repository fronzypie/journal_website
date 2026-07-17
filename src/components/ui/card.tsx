import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardVariant = "frosted" | "elevated" | "quiet" | "outline";

type CardProps = HTMLAttributes<HTMLElement> & {
  as?: "article" | "aside" | "div" | "section";
  children: ReactNode;
  variant?: CardVariant;
};

const variants: Record<CardVariant, string> = {
  frosted: "ds-surface",
  elevated: "ds-surface-strong",
  quiet: "border border-white/8 bg-white/[0.035]",
  outline: "border border-white/12 bg-transparent",
};

export function Card({
  as: Component = "article",
  children,
  className,
  variant = "frosted",
  ...props
}: CardProps) {
  return (
    <Component
      className={cn("rounded-lg", variants[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

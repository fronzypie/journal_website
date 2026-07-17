import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "quiet" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

type AnchorButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-porcelain text-ink shadow-glow hover:bg-white active:bg-muted-strong",
  secondary:
    "border border-white/14 bg-white/8 text-porcelain hover:border-white/24 hover:bg-white/12",
  ghost: "text-muted-strong hover:bg-white/8 hover:text-porcelain",
  quiet: "bg-transparent text-muted hover:text-porcelain",
  danger:
    "border border-rose/35 bg-rose/12 text-rose hover:border-rose/55 hover:bg-rose/18",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

function buttonClasses({
  className,
  size,
  variant,
}: {
  className?: string;
  size: ButtonSize;
  variant: ButtonVariant;
}) {
  return cn(
    "ds-focus-visible ds-transition inline-flex items-center justify-center rounded-full font-medium disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button({
  children,
  className,
  size = "md",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses({ className, size, variant })}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export function AnchorButton({
  children,
  className,
  size = "md",
  variant = "primary",
  ...props
}: AnchorButtonProps) {
  return (
    <a className={buttonClasses({ className, size, variant })} {...props}>
      {children}
    </a>
  );
}

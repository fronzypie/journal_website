import { forwardRef } from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldBase =
  "ds-focus-visible ds-transition w-full rounded-md border border-white/12 bg-white/[0.055] text-sm text-porcelain [box-shadow:var(--ds-shadow-hairline)] outline-none placeholder:text-muted/70 hover:border-white/18 focus:border-blue/55 disabled:cursor-not-allowed disabled:opacity-50";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn("h-11 px-4", fieldBase, className)}
      type={type}
      {...props}
    />
  );
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-32 resize-none px-4 py-3 leading-7",
        fieldBase,
        className,
      )}
      {...props}
    />
  );
}

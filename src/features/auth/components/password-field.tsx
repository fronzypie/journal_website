"use client";

import { useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type PasswordFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  error?: string;
  label: string;
};

export function PasswordField({
  className,
  error,
  id,
  label,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-muted-strong"
        htmlFor={fieldId}
      >
        {label}
      </label>
      <div className="relative">
        <Input
          aria-describedby={error ? `${fieldId}-error` : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete={props.autoComplete ?? "current-password"}
          className={cn(
            "pr-12",
            error && "border-rose/45 focus:border-rose/55",
            className,
          )}
          id={fieldId}
          type={visible ? "text" : "password"}
          {...props}
        />
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className="ds-focus-visible ds-transition absolute top-1/2 right-3 -translate-y-1/2 rounded-sm px-1 text-xs text-muted hover:text-porcelain"
          onClick={() => setVisible((value) => !value)}
          type="button"
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {error ? (
        <p
          className="text-xs text-rose"
          id={`${fieldId}-error`}
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

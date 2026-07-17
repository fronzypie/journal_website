import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label: string;
};

export function AuthField({
  className,
  error,
  id,
  label,
  ...props
}: AuthFieldProps) {
  const fieldId = id ?? props.name;

  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-medium text-muted-strong"
        htmlFor={fieldId}
      >
        {label}
      </label>
      <Input
        aria-describedby={error ? `${fieldId}-error` : undefined}
        aria-invalid={error ? true : undefined}
        className={cn(
          error && "border-rose/45 focus:border-rose/55",
          className,
        )}
        id={fieldId}
        {...props}
      />
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

"use client";

import { getPasswordStrength, strengthColors, strengthLabels } from "@/features/auth/lib/password-strength";
import { cn } from "@/lib/cn";

type PasswordStrengthIndicatorProps = {
  password: string;
};

export function PasswordStrengthIndicator({
  password,
}: PasswordStrengthIndicatorProps) {
  const { score, label, checks } = getPasswordStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div aria-live="polite" className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-1 gap-1.5">
          {[1, 2, 3, 4].map((segment) => (
            <div
              className={cn(
                "h-1 flex-1 rounded-full transition-colors duration-300",
                score >= segment ? strengthColors[label] : "bg-white/10",
              )}
              key={segment}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-strong">
          {strengthLabels[label]}
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted">
        <li className={checks.length ? "text-sage" : undefined}>
          8+ characters
        </li>
        <li className={checks.lowercase ? "text-sage" : undefined}>
          Lowercase letter
        </li>
        <li className={checks.uppercase ? "text-sage" : undefined}>
          Uppercase letter
        </li>
        <li className={checks.number ? "text-sage" : undefined}>
          Number
        </li>
        <li className={checks.symbol ? "text-sage" : undefined}>
          Symbol
        </li>
      </ul>
    </div>
  );
}

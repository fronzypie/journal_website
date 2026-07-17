export type PasswordStrengthLevel = 0 | 1 | 2 | 3 | 4;

export type PasswordStrengthResult = {
  score: PasswordStrengthLevel;
  label: "empty" | "weak" | "fair" | "good" | "strong";
  checks: {
    length: boolean;
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    symbol: boolean;
  };
};

export function getPasswordStrength(password: string): PasswordStrengthResult {
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };

  if (!password) {
    return { score: 0, label: "empty", checks };
  }

  const variety = [
    checks.lowercase,
    checks.uppercase,
    checks.number,
    checks.symbol,
  ].filter(Boolean).length;

  if (password.length < 8 || variety <= 1) {
    return { score: 1, label: "weak", checks };
  }

  if (password.length < 12 || variety <= 2) {
    return { score: 2, label: "fair", checks };
  }

  if (variety <= 3) {
    return { score: 3, label: "good", checks };
  }

  return { score: 4, label: "strong", checks };
}

export const strengthColors: Record<
  PasswordStrengthResult["label"],
  string
> = {
  empty: "bg-white/10",
  weak: "bg-rose",
  fair: "bg-amber",
  good: "bg-blue",
  strong: "bg-sage",
};

export const strengthLabels: Record<
  PasswordStrengthResult["label"],
  string
> = {
  empty: "",
  weak: "Weak",
  fair: "Fair",
  good: "Good",
  strong: "Strong",
};

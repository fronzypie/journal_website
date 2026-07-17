"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { AnchorButton, Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthLink } from "@/features/auth/components/auth-link";
import { PasswordField } from "@/features/auth/components/password-field";
import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import {
  hasErrors,
  validateResetPassword,
  type FieldErrors,
  type ResetPasswordValues,
} from "@/features/auth/lib/validation";

const initialValues: ResetPasswordValues = {
  password: "",
  confirmPassword: "",
};

export function ResetPasswordForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<ResetPasswordValues>>({});
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { updatePassword } = useAuth();
  const router = useRouter();

  function handleChange(field: keyof ResetPasswordValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    const nextErrors = validateResetPassword(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    const { error } = await updatePassword(values.password);

    if (error) {
      setStatusMessage(error);
      return;
    }

    setSubmitted(true);
    router.push("/login");
  }

  if (submitted) {
    return (
      <AuthCard
        subtitle="Your password has been updated. You can sign in with your new password."
        title="Password updated"
      >
        <p className="ds-text-body text-center text-sm">
          You can continue to sign in and return to your journal.
        </p>
        <AnchorButton className="mt-6 w-full" href="/login">
          Continue to sign in
        </AnchorButton>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      footer={
        <AuthLink className="text-sm" href="/login">
          Back to sign in
        </AuthLink>
      }
      subtitle="Choose a new password for your account."
      title="Set new password"
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <div className="space-y-3">
          <PasswordField
            autoComplete="new-password"
            error={errors.password}
            label="New password"
            name="password"
            onChange={(event) => handleChange("password", event.target.value)}
            placeholder="Enter a new password"
            value={values.password}
          />
          <PasswordStrengthIndicator password={values.password} />
        </div>
        <PasswordField
          autoComplete="new-password"
          error={errors.confirmPassword}
          label="Confirm new password"
          name="confirmPassword"
          onChange={(event) =>
            handleChange("confirmPassword", event.target.value)
          }
          placeholder="Repeat your new password"
          value={values.confirmPassword}
        />
        {statusMessage ? (
          <p className="text-sm text-rose" role="alert">
            {statusMessage}
          </p>
        ) : null}
        <Button className="w-full" size="lg" type="submit">
          Update password
        </Button>
      </form>
    </AuthCard>
  );
}

"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthField } from "@/features/auth/components/auth-field";
import { AuthLink } from "@/features/auth/components/auth-link";
import {
  hasErrors,
  validateForgotPassword,
  type FieldErrors,
  type ForgotPasswordValues,
} from "@/features/auth/lib/validation";

const initialValues: ForgotPasswordValues = {
  email: "",
};

export function ForgotPasswordForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<ForgotPasswordValues>>({});
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { resetPassword } = useAuth();

  function handleChange(field: keyof ForgotPasswordValues, value: string) {
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
    const nextErrors = validateForgotPassword(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    const { error } = await resetPassword(values.email);

    if (error) {
      setStatusMessage(error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AuthCard
        subtitle="If an account exists for this address, a secure reset link will be sent."
        title="Check your inbox"
      >
        <p className="ds-text-body text-center text-sm">
          We sent recovery instructions to{" "}
          <span className="text-porcelain">{values.email}</span>.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            onClick={() => {
              setSubmitted(false);
              setValues(initialValues);
              setStatusMessage(null);
            }}
            type="button"
            variant="secondary"
          >
            Try another email
          </Button>
          <AuthLink className="text-center text-sm" href="/login">
            Back to sign in
          </AuthLink>
        </div>
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
      subtitle="Enter the email associated with your account."
      title="Reset password"
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <AuthField
          autoComplete="email"
          error={errors.email}
          label="Email"
          name="email"
          onChange={(event) => handleChange("email", event.target.value)}
          placeholder="you@example.com"
          type="email"
          value={values.email}
        />
        {statusMessage ? (
          <p className="text-sm text-rose" role="alert">
            {statusMessage}
          </p>
        ) : null}
        <Button className="w-full" size="lg" type="submit">
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}

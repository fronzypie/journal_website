"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthField } from "@/features/auth/components/auth-field";
import { AuthLink } from "@/features/auth/components/auth-link";
import { PasswordField } from "@/features/auth/components/password-field";
import { PasswordStrengthIndicator } from "@/features/auth/components/password-strength-indicator";
import {
  hasErrors,
  validateRegister,
  type FieldErrors,
  type RegisterValues,
} from "@/features/auth/lib/validation";

const initialValues: RegisterValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<RegisterValues>>({});
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { signUp } = useAuth();
  const router = useRouter();

  function handleChange(field: keyof RegisterValues, value: string) {
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
    const nextErrors = validateRegister(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    const { error, needsConfirmation } = await signUp(
      values.email,
      values.password,
      values.name,
    );

    if (error) {
      setStatusMessage(error);
      return;
    }

    if (needsConfirmation) {
      setSubmitted(true);
      return;
    }

    router.push("/dashboard");
  }

  if (submitted) {
    return (
      <AuthCard
        subtitle="We sent a confirmation email to your address. You can sign in once it is confirmed."
        title="Almost there"
      >
        <p className="ds-text-body text-center text-sm">
          A confirmation link was sent to{" "}
          <span className="text-porcelain">{values.email}</span>.
        </p>
        <Button
          className="mt-6 w-full"
          onClick={() => {
            setSubmitted(false);
            setValues(initialValues);
            setStatusMessage(null);
          }}
          type="button"
        >
          Back to registration
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      footer={
        <>
          Already have an account? <AuthLink href="/login">Sign in</AuthLink>
        </>
      }
      subtitle="Create your private space for reflection."
      title="Join Aster"
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit}>
        <AuthField
          autoComplete="name"
          error={errors.name}
          label="Name"
          name="name"
          onChange={(event) => handleChange("name", event.target.value)}
          placeholder="Your name"
          value={values.name}
        />
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
        <div className="space-y-3">
          <PasswordField
            autoComplete="new-password"
            error={errors.password}
            label="Password"
            name="password"
            onChange={(event) => handleChange("password", event.target.value)}
            placeholder="Create a password"
            value={values.password}
          />
          <PasswordStrengthIndicator password={values.password} />
        </div>
        <PasswordField
          autoComplete="new-password"
          error={errors.confirmPassword}
          label="Confirm password"
          name="confirmPassword"
          onChange={(event) =>
            handleChange("confirmPassword", event.target.value)
          }
          placeholder="Repeat your password"
          value={values.confirmPassword}
        />
        {statusMessage ? (
          <p className="text-sm text-rose" role="alert">
            {statusMessage}
          </p>
        ) : null}
        <Button className="w-full" size="lg" type="submit">
          Create account
        </Button>
      </form>
    </AuthCard>
  );
}

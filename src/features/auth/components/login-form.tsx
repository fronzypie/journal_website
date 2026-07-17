"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthField } from "@/features/auth/components/auth-field";
import { AuthLink } from "@/features/auth/components/auth-link";
import { PasswordField } from "@/features/auth/components/password-field";
import {
  hasErrors,
  validateLogin,
  type FieldErrors,
  type LoginValues,
} from "@/features/auth/lib/validation";

const initialValues: LoginValues = {
  email: "",
  password: "",
};

export function LoginForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors<LoginValues>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter();

  function handleChange(field: keyof LoginValues, value: string) {
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
    const nextErrors = validateLogin(values);
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      return;
    }

    const { error } = await signIn(values.email, values.password);

    if (error) {
      setStatusMessage(error);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthCard
      footer={
        <>
          Don&apos;t have an account?{" "}
          <AuthLink href="/register">Create one</AuthLink>
        </>
      }
      subtitle="Return to your private journal."
      title="Welcome back"
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
        <div className="space-y-2">
          <PasswordField
            autoComplete="current-password"
            error={errors.password}
            label="Password"
            name="password"
            onChange={(event) => handleChange("password", event.target.value)}
            placeholder="Enter your password"
            value={values.password}
          />
          <div className="flex justify-end">
            <AuthLink className="text-xs" href="/forgot-password">
              Forgot password?
            </AuthLink>
          </div>
        </div>
        {statusMessage ? (
          <p className="text-sm text-rose" role="alert">
            {statusMessage}
          </p>
        ) : null}
        <Button className="w-full" size="lg" type="submit">
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}

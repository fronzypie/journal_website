import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { requireAnonymousUser } from "@/lib/supabase/auth-guard";

export const metadata: Metadata = {
  title: "Reset password — Aster Journal",
  description: "Request a password reset link for your Aster Journal account.",
};

export default async function ForgotPasswordPage() {
  await requireAnonymousUser();
  return <ForgotPasswordForm />;
}

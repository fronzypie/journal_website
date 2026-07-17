import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Set new password — Aster Journal",
  description: "Choose a new password for your Aster Journal account.",
};

export default async function ResetPasswordPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Supabase password reset emails arrive with an authenticated session,
  // so we need to allow authenticated users to access this page.
  if (!user) {
    redirect("/login");
  }

  return <ResetPasswordForm />;
}
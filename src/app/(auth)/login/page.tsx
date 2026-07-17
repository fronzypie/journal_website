import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/components/login-form";
import { requireAnonymousUser } from "@/lib/supabase/auth-guard";

export const metadata: Metadata = {
  title: "Sign in — Aster Journal",
  description: "Sign in to your Aster Journal account.",
};

export default async function LoginPage() {
  await requireAnonymousUser();
  return <LoginForm />;
}

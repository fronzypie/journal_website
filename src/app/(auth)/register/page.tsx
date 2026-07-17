import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/components/register-form";
import { requireAnonymousUser } from "@/lib/supabase/auth-guard";

export const metadata: Metadata = {
  title: "Create account — Aster Journal",
  description: "Create your Aster Journal account.",
};

export default async function RegisterPage() {
  await requireAnonymousUser();
  return <RegisterForm />;
}

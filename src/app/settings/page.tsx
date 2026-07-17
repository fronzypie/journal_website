import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SettingsView } from "@/features/settings/components/settings-view";

export const metadata: Metadata = {
  title: "Settings — Aster Journal",
  description: "Manage your profile, theme, notifications, privacy, and account settings.",
};

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SettingsView
      accountCreatedAt={user.created_at}
      email={user.email ?? ""}
      fullName={user.user_metadata?.full_name || user.email?.split("@")[0] || "friend"}
      userId={user.id}
    />
  );
}
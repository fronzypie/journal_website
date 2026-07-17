import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthMenu } from "@/components/auth/auth-menu";
import { DashboardView } from "@/features/journal/components/dashboard-view";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard — Aster Journal",
  description: "Your journal dashboard with recent entries, streaks, and activity.",
};

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function formatDisplayDate() {
  return new Date().toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "friend";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-end px-4 pt-6 sm:px-6 lg:px-8">
        <AuthMenu />
      </div>
      <DashboardView
        displayDate={formatDisplayDate()}
        greeting={getGreeting()}
        streak={8}
        userName={displayName}
      />
    </div>
  );
}
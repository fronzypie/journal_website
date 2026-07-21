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

function toDateKey(value: string) {
  return value.split("T")[0];
}

function calculateStreak(entries: Array<{ entry_date: string }>) {
  if (entries.length === 0) {
    return 0;
  }

  const uniqueDates = new Set(entries.map((entry) => toDateKey(entry.entry_date)));
  const latest = new Date(`${toDateKey(entries[0].entry_date)}T00:00:00`);
  let streak = 0;
  const cursor = new Date(latest);

  while (true) {
    const key = cursor.toISOString().split("T")[0];
    if (!uniqueDates.has(key)) {
      break;
    }

    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
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
  const [{ data: recentEntries }, { data: pinnedEntries }, { data: collections }, { data: allEntries }] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("id,title,mood,reading_time_minutes,updated_at,entry_date,is_pinned")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(3),
    supabase
      .from("journal_entries")
      .select("id,title,mood,reading_time_minutes,updated_at,entry_date,is_pinned")
      .eq("user_id", user.id)
      .eq("is_pinned", true)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("journal_collections")
      .select("id,name")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("journal_entries")
      .select("entry_date")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false }),
  ]);

  const recent = (recentEntries ?? []).map((entry) => ({
    id: entry.id,
    title: entry.title,
    mood: entry.mood,
    readingTimeMinutes: entry.reading_time_minutes,
    updatedAt: entry.updated_at,
    entryDate: entry.entry_date,
    isPinned: entry.is_pinned,
  }));

  const favorite = (pinnedEntries?.length ? pinnedEntries : recentEntries ?? []).slice(0, 2).map((entry) => ({
    id: entry.id,
    title: entry.title,
    mood: entry.mood,
    readingTimeMinutes: entry.reading_time_minutes,
    updatedAt: entry.updated_at,
    entryDate: entry.entry_date,
    isPinned: entry.is_pinned,
  }));

  const collectionSummary = (collections ?? []).map((collection) => ({
    id: collection.id,
    name: collection.name,
  }));

  const activity = recent.slice(0, 3).map((entry) => ({
    title: entry.title || "Untitled entry",
    detail: new Date(entry.updatedAt).toLocaleDateString("en", {
      month: "short",
      day: "numeric",
    }),
  }));
  const streak = calculateStreak((allEntries ?? []) as Array<{ entry_date: string }>);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-end px-4 pt-6 sm:px-6 lg:px-8">
        <AuthMenu />
      </div>
      <DashboardView
        activity={activity}
        collections={collectionSummary}
        displayDate={formatDisplayDate()}
        greeting={getGreeting()}
        favoriteEntries={favorite}
        recentEntries={recent}
        streak={streak}
        userName={displayName}
      />
    </div>
  );
}

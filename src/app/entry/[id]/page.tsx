import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { EntryDetailView } from "@/features/journal/components/entry-detail-view";

type EntryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      title: "Entry — Aster Journal",
      description: "View your journal entry.",
    };
  }

  const { data: entry } = await supabase
    .from("journal_entries")
    .select("title")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return {
    title: entry?.title ? `${entry.title} — Aster Journal` : "Entry — Aster Journal",
    description: "View your journal entry.",
  };
}

export default async function EntryDetailPage({ params }: EntryPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: entry, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !entry) {
    redirect("/dashboard");
  }

  const { data: collections } = await supabase
    .from("journal_collections")
    .select("id, name")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true });

  return <EntryDetailView entry={entry} collections={collections || []} />;
}

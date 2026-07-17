import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { CollectionsView } from "@/features/journal/components/collections-view";

export const metadata: Metadata = {
  title: "Collections — Aster Journal",
  description: "Organize your journal entries into curated collections.",
};

export default async function CollectionsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <CollectionsView userId={user.id} />;
}
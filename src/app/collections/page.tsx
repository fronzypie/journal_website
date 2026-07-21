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

  const [{ data: collections }, { data: entries }] = await Promise.all([
    supabase
      .from("journal_collections")
      .select("id,name,tone,summary,cover_image,sort_order,created_at")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("journal_entries")
      .select("collection_id")
      .eq("user_id", user.id),
  ]);

  const collectionCounts = new Map<string, number>();
  for (const entry of entries ?? []) {
    if (entry.collection_id) {
      collectionCounts.set(
        entry.collection_id,
        (collectionCounts.get(entry.collection_id) ?? 0) + 1,
      );
    }
  }

  const hydratedCollections = (collections ?? []).map((collection) => ({
    id: collection.id,
    name: collection.name,
    tone: collection.tone,
    summary: collection.summary,
    coverImage: collection.cover_image,
    itemCount: collectionCounts.get(collection.id) ?? 0,
  }));

  return <CollectionsView initialCollections={hydratedCollections} />;
}

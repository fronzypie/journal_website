import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  publicSearchDocuments,
  type SearchDocument,
} from "@/features/search/data/search-index";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ documents: publicSearchDocuments });
  }

  const [{ data: entries }, { data: collections }] = await Promise.all([
    supabase
      .from("journal_entries")
      .select("id,title,content,excerpt,mood,tags,entry_date,cover_image,collection_id")
      .eq("user_id", user.id)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("journal_collections")
      .select("id,name,tone,summary,cover_image")
      .eq("user_id", user.id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
  ]);

  const userDocuments: SearchDocument[] = [
    ...(entries ?? []).map((entry) => ({
      id: entry.id,
      kind: "entry" as const,
      title: entry.title || "Untitled entry",
      content: entry.excerpt || entry.content || "",
      tags: entry.tags ?? [],
      collection: entry.collection_id ?? "Journal entries",
      date: entry.entry_date,
      href: `/entry/${entry.id}`,
      mood: entry.mood,
      image: entry.cover_image ?? undefined,
    })),
    ...(collections ?? []).map((collection) => ({
      id: collection.id,
      kind: "collection" as const,
      title: collection.name,
      content: `${collection.tone}. ${collection.summary}`,
      tags: [collection.name.toLowerCase(), "collection", collection.tone],
      collection: collection.name,
      href: "/collections",
      image: collection.cover_image,
    })),
  ];

  return NextResponse.json({
    documents: [...publicSearchDocuments, ...userDocuments],
  });
}

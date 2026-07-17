import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("user_id", user.id)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, content, mood, tags, entry_date } = body;

  if (!title && !content) {
    return NextResponse.json({ error: "Title or content is required." }, { status: 400 });
  }

  const wordCount = content ? content.trim().split(/\s+/).filter(Boolean).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));
  const excerpt = content
    ? content.replace(/<[^>]+>/g, "").slice(0, 200).trim()
    : "";

  const { data, error } = await supabase
    .from("journal_entries")
    .insert({
      user_id: user.id,
      title: title ?? "",
      content: content ?? "",
      excerpt,
      mood: mood ?? "calm",
      tags: tags ?? [],
      entry_date: entry_date ?? new Date().toISOString().split("T")[0],
      word_count: wordCount,
      reading_time_minutes: readingTime,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data }, { status: 201 });
}
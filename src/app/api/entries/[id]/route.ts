import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteParams = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: RouteParams }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data, error } = await supabase
    .from("journal_entries")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}

export async function PATCH(request: Request, { params }: { params: RouteParams }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, content, mood, tags, is_pinned, collection_id } = body;

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (content !== undefined) {
    updateData.content = content;
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    updateData.word_count = wordCount;
    updateData.reading_time_minutes = Math.max(1, Math.ceil(wordCount / 180));
    updateData.excerpt = content.replace(/<[^>]+>/g, "").slice(0, 200).trim();
  }
  if (mood !== undefined) updateData.mood = mood;
  if (tags !== undefined) updateData.tags = tags;
  if (is_pinned !== undefined) updateData.is_pinned = is_pinned;
  if (collection_id !== undefined) updateData.collection_id = collection_id;

  const { data, error } = await supabase
    .from("journal_entries")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data });
}

export async function DELETE(request: Request, { params }: { params: RouteParams }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { error } = await supabase
    .from("journal_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
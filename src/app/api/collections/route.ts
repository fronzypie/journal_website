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
    .from("journal_collections")
    .select("*")
    .eq("user_id", user.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ collections: data });
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
  const { name, tone, summary, cover_image } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Collection name is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("journal_collections")
    .insert({
      user_id: user.id,
      name: name.trim(),
      tone: tone ?? "",
      summary: summary ?? "",
      cover_image: cover_image ?? "",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ collection: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const orderedIds = Array.isArray(body.orderedIds) ? body.orderedIds : null;

  if (!orderedIds) {
    return NextResponse.json({ error: "orderedIds is required." }, { status: 400 });
  }

  for (const item of orderedIds) {
    if (!item?.id || typeof item.sort_order !== "number") {
      return NextResponse.json({ error: "Invalid order payload." }, { status: 400 });
    }
  }

  const updates = orderedIds.map((item: { id: string; sort_order: number }) =>
    supabase
      .from("journal_collections")
      .update({ sort_order: item.sort_order })
      .eq("id", item.id)
      .eq("user_id", user.id),
  );

  const results = await Promise.all(updates);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

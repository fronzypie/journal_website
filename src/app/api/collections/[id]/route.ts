import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RouteParams = Promise<{ id: string }>;

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
  const { name, tone, summary, cover_image } = body;

  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Collection name is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("journal_collections")
    .update({
      name: name.trim(),
      tone: tone ?? "",
      summary: summary ?? "",
      cover_image: cover_image ?? "",
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ collection: data });
}

export async function DELETE(_request: Request, { params }: { params: RouteParams }) {
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
    .from("journal_collections")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

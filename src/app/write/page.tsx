import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DistractionFreeEditor } from "@/features/journal/components/distraction-free-editor";

export const metadata: Metadata = {
  title: "Write — Aster Journal",
  description: "A calm, distraction-free space for your journal entries.",
};

export default async function WritePage(props: { searchParams: Promise<{ id?: string }> }) {
  const searchParams = await props.searchParams;
  const entryId = searchParams.id;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DistractionFreeEditor
      userId={user.id}
      userName={user.user_metadata?.full_name || user.email?.split("@")[0] || "friend"}
      entryId={entryId}
    />
  );
}
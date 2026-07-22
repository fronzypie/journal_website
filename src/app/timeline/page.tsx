import type { Metadata } from "next";
import { TimelineView } from "@/features/journal/components/timeline-view";

export const metadata: Metadata = {
  title: "Timeline — Aster Journal",
  description: "Browse your journal memories arranged by year, month, and day.",
};

export default async function TimelinePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  return <TimelineView initialSearch={q} />;
}
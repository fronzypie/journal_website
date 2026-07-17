import type { Metadata } from "next";
import { TimelineView } from "@/features/journal/components/timeline-view";

export const metadata: Metadata = {
  title: "Timeline — Aster Journal",
  description: "Browse your journal memories arranged by year, month, and day.",
};

export default function TimelinePage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  return <TimelineView initialSearch={searchParams?.q ?? ""} />;
}
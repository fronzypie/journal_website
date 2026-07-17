import type { Metadata } from "next";
import { CalendarView } from "@/features/journal/components/calendar-view";

export const metadata: Metadata = {
  title: "Calendar — Aster Journal",
  description: "Browse your journal entries on a month-by-month calendar with mood colors.",
};

export default function CalendarPage() {
  return <CalendarView />;
}
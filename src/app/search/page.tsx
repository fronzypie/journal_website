import type { Metadata } from "next";
import { SearchResultsView } from "@/features/search/components/search-results-view";

export const metadata: Metadata = {
  title: "Search — Aster Journal",
  description: "Search your journal entries, collections, and content.",
};

export default function SearchPage() {
  return <SearchResultsView />;
}
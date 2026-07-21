import type { SearchDocument } from "@/features/search/data/search-index";

export function scoreSearchDocument(document: SearchDocument, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return 1;
  }

  const tokens = normalized.split(/\s+/).filter(Boolean);
  const searchSpace = [
    document.title,
    document.content,
    document.tags.join(" "),
    document.mood ?? "",
    document.collection ?? "",
    document.date ?? "",
    document.kind,
  ]
    .join(" ")
    .toLowerCase();

  if (!tokens.every((token) => searchSpace.includes(token))) {
    return 0;
  }

  let score = 1;
  if (document.title.toLowerCase().includes(normalized)) score += 6;
  if (document.collection?.toLowerCase().includes(normalized)) score += 4;
  if (document.tags.some((tag) => tag.toLowerCase().includes(normalized))) score += 3;
  if (document.mood?.toLowerCase().includes(normalized)) score += 2;
  if (document.date?.toLowerCase().includes(normalized)) score += 2;
  if (document.content.toLowerCase().includes(normalized)) score += 1;

  return score;
}

export function formatSearchResultLabel(document: SearchDocument) {
  if (document.kind === "collection") return "Collection";
  if (document.kind === "page") return "Page";
  return "Entry";
}

export function searchAndRankDocuments(documents: SearchDocument[], query: string) {
  return documents
    .map((document) => ({ document, score: scoreSearchDocument(document, query) }))
    .filter((item) => item.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.document.title.localeCompare(right.document.title),
    )
    .map((item) => item.document);
}

import { initialCollections } from "@/features/journal/data/collection-data";
import { recentEntries } from "@/features/journal/data/journal-data";
import { timelineMemories } from "@/features/journal/data/timeline-data";

export type SearchKind = "entry" | "collection" | "page";

export type SearchDocument = {
  collection?: string;
  content: string;
  date?: string;
  href: string;
  id: string;
  image?: string;
  kind: SearchKind;
  mood?: string;
  tags: string[];
  title: string;
};

export const searchDocuments: SearchDocument[] = [
  {
    id: "page-home",
    kind: "page",
    title: "Home",
    content:
      "Landing page for the journal, including features, preview, testimonials, and FAQ.",
    tags: ["home", "landing", "overview"],
    href: "/",
  },
  {
    id: "page-dashboard",
    kind: "page",
    title: "Dashboard",
    content:
      "Authenticated home with greeting, streak, recent entries, favorites, collections, and activity.",
    tags: ["dashboard", "overview", "activity"],
    href: "/dashboard",
  },
  {
    id: "page-write",
    kind: "page",
    title: "Write",
    content:
      "Distraction-free editor with markdown, autosave, mood selection, tags, and live preview.",
    tags: ["write", "editor", "markdown"],
    href: "/write",
  },
  {
    id: "page-timeline",
    kind: "page",
    title: "Timeline",
    content:
      "Memory archive grouped by year, month, and day with search and filtering.",
    tags: ["timeline", "archive", "memories"],
    href: "/timeline",
  },
  {
    id: "page-collections",
    kind: "page",
    title: "Collections",
    content:
      "Collection manager for travel, college, family, goals, and dreams.",
    tags: ["collections", "archive", "organization"],
    href: "/collections",
  },
  ...recentEntries.map((entry) => ({
    id: entry.id,
    kind: "entry" as const,
    title: entry.title,
    content: entry.excerpt,
    tags: [entry.mood, "reflection", "entry"],
    collection: "Recent reflections",
    date: entry.date,
    href: "/timeline",
    mood: entry.mood,
  })),
  ...timelineMemories.map((memory) => ({
    id: memory.id,
    kind: "entry" as const,
    title: memory.title,
    content: memory.preview,
    tags: memory.tags,
    collection: `${memory.month} ${memory.year}`,
    date: memory.date,
    href: "/timeline",
    mood: memory.mood,
    image: memory.image,
  })),
  ...initialCollections.map((collection) => ({
    id: collection.id,
    kind: "collection" as const,
    title: collection.name,
    content: `${collection.tone}. ${collection.summary}`,
    tags: [collection.name.toLowerCase(), "collection", collection.tone],
    collection: collection.name,
    href: "/collections",
    image: collection.coverImage,
  })),
];

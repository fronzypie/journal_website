import type { JournalEntryPreview, JournalPrompt } from "@/types/journal";

export const reflectionPrompts: JournalPrompt[] = [
  {
    id: "morning",
    label: "Morning",
    prompt: "What deserves your first honest attention today?",
  },
  {
    id: "evening",
    label: "Evening",
    prompt: "What did you carry that you can set down now?",
  },
  {
    id: "clarity",
    label: "Clarity",
    prompt: "What feels true before you explain it?",
  },
];

export const recentEntries: JournalEntryPreview[] = [
  {
    id: "entry-01",
    title: "A quieter kind of ambition",
    excerpt:
      "Not everything important arrived loudly today. Some of it moved like weather, almost too gently to name.",
    mood: "clear",
    date: "Jul 17",
    wordCount: 824,
  },
  {
    id: "entry-02",
    title: "After the rain",
    excerpt:
      "The city looked rinsed clean tonight, and for a few minutes my thoughts did too.",
    mood: "still",
    date: "Jul 16",
    wordCount: 512,
  },
  {
    id: "entry-03",
    title: "Things I did not rush",
    excerpt:
      "I kept returning to the same sentence until it finally became a door instead of a wall.",
    mood: "tender",
    date: "Jul 14",
    wordCount: 1036,
  },
];

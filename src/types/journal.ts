export type JournalEntryMood =
  "still" | "clear" | "tender" | "restless" | "bright";

export type JournalPrompt = {
  id: string;
  label: string;
  prompt: string;
};

export type JournalEntryPreview = {
  id: string;
  title: string;
  excerpt: string;
  mood: JournalEntryMood;
  date: string;
  wordCount: number;
};

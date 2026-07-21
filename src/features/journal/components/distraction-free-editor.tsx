"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { renderEditorPreview } from "@/lib/markdown";

type EditorProps = {
  userId: string;
  userName: string;
  entryId?: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

type StoredEntry = {
  title: string;
  content: string;
  mood: string;
  tagsInput: string;
  updatedAt: string;
};

const moodOptions = [
  { value: "calm", label: "Calm" },
  { value: "reflective", label: "Reflective" },
  { value: "hopeful", label: "Hopeful" },
  { value: "introspective", label: "Introspective" },
  { value: "restless", label: "Restless" },
];

function getStorageKey(userId: string) {
  return `journal-editor:${userId}`;
}

export function DistractionFreeEditor({ userId, userName, entryId }: EditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("calm");
  const [tagsInput, setTagsInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(entryId ?? null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const storageKey = useMemo(() => getStorageKey(userId), [userId]);
  const deferredContent = useDeferredValue(content);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredEntry;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrates client-only localStorage draft after mount.
        setTitle(parsed.title ?? "");
        setContent(parsed.content ?? "");
        setMood(parsed.mood ?? "calm");
        setTagsInput(parsed.tagsInput ?? "");
      }
    } catch {
      // Ignore malformed local data.
    }

    setHydrated(true);
  }, [storageKey]);

  const saveToSupabase = useCallback(async () => {
    if (!currentEntryId) {
      return;
    }

    setSaveStatus("saving");
    setErrorMessage(null);

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await fetch(`/api/entries/${currentEntryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          mood,
          tags,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to save entry.");
      }

      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to save entry.");
    }
  }, [content, currentEntryId, mood, tagsInput, title]);

  const createEntryInSupabase = useCallback(async () => {
    if (!title.trim() && !content.trim()) {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("saving");
    setErrorMessage(null);

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          mood,
          tags,
          entry_date: new Date().toISOString().split("T")[0],
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Failed to create entry.");
      }

      const payload = await response.json();
      const newId = payload.entry.id;
      setCurrentEntryId(newId);

      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Failed to create entry.");
    }
  }, [content, mood, tagsInput, title]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    const payload: StoredEntry = {
      title,
      content,
      mood,
      tagsInput,
      updatedAt: new Date().toISOString(),
    };

    window.localStorage.setItem(storageKey, JSON.stringify(payload));
  }, [content, hydrated, mood, storageKey, tagsInput, title]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      if (currentEntryId) {
        saveToSupabase();
      } else {
        createEntryInSupabase();
      }
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [
    content,
    createEntryInSupabase,
    currentEntryId,
    hydrated,
    mood,
    saveToSupabase,
    tagsInput,
    title,
  ]);

  const tags = useMemo(() => {
    return tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 6);
  }, [tagsInput]);

  const wordCount = useMemo(() => {
    if (!content.trim()) {
      return 0;
    }

    return content.trim().split(/\s+/).length;
  }, [content]);

  const characterCount = content.length;
  const readingTime = useMemo(() => Math.max(1, Math.ceil(wordCount / 180)), [wordCount]);
  const previewMarkup = useMemo(
    () => renderEditorPreview(title, deferredContent),
    [deferredContent, title],
  );

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-5 shadow-elevated backdrop-blur-2xl sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="ds-caption">Distraction-free editor</p>
              <h1 className="mt-2 text-3xl font-semibold text-porcelain sm:text-4xl">
                Write with calm, focus, and momentum.
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 rounded-full border border-white/10 bg-black/15 px-3 py-2 text-sm text-muted-strong">
                <span className="text-muted">Mood</span>
                <select
                  aria-label="Select mood"
                  className="bg-transparent text-sm font-medium text-porcelain outline-none"
                  onChange={(event) => setMood(event.target.value)}
                  value={mood}
                >
                  {moodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div
                className={`rounded-full border px-3 py-2 text-sm ${
                  saveStatus === "error"
                    ? "border-rose/45 bg-rose/12 text-rose"
                    : "border-white/10 bg-white/[0.045] text-muted-strong"
                }`}
              >
                {saveStatus === "saving" && "Saving…"}
                {saveStatus === "saved" && `Autosaved • ${lastSavedAt ?? "just now"}`}
                {saveStatus === "idle" && "Ready to save"}
                {saveStatus === "error" && (errorMessage ?? "Save failed")}
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card as="section" className="p-5 sm:p-6" variant="elevated">
            <label className="block">
              <span className="sr-only">Entry title</span>
              <input
                aria-label="Entry title"
                className="w-full border-none bg-transparent text-4xl font-semibold leading-tight text-porcelain outline-none placeholder:text-muted sm:text-5xl"
                onChange={(event) => setTitle(event.target.value)}
                placeholder="A quiet title"
                value={title}
              />
            </label>

            <div className="mt-6 flex flex-wrap items-center gap-3 border-y border-white/10 py-4">
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted">
                {wordCount} words
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted">
                {characterCount} chars
              </div>
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted">
                {readingTime} min read
              </div>
            </div>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-muted-strong">Tags</span>
              <input
                aria-label="Tags"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-porcelain outline-none placeholder:text-muted"
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="calm, gratitude, winter"
                value={tagsInput}
              />
            </label>

            <div className="mt-3 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-sm text-muted-strong"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/15 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between text-sm text-muted">
                <span>Markdown support</span>
                <span>Write freely • stay present</span>
              </div>
              <textarea
                aria-label="Journal content"
                className="min-h-[420px] w-full resize-none border-none bg-transparent text-[1.03rem] leading-8 text-porcelain outline-none placeholder:text-muted"
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write here..."
                spellCheck={false}
                value={content}
              />
            </div>
          </Card>

          <Card as="aside" className="p-5 sm:p-6" variant="quiet">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="ds-caption">Live preview</p>
                <h2 className="mt-2 text-2xl font-semibold text-porcelain">
                  {userName}&apos;s quiet page
                </h2>
              </div>
              <Button size="sm" variant="ghost">
                Share
              </Button>
            </div>

            <div
              className="prose prose-invert mt-6 max-w-none text-sm leading-7 text-muted-strong"
              dangerouslySetInnerHTML={{ __html: previewMarkup }}
            />
          </Card>
        </div>
      </div>
    </main>
  );
}

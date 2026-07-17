"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EditorProps = {
  userId: string;
  userName: string;
};

type SaveStatus = "idle" | "saving" | "saved";

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

function buildMarkdownPreview(title: string, markdown: string) {
  if (!markdown.trim()) {
    return `
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.24em] text-muted">Preview</p>
        <h2 class="text-2xl font-semibold text-porcelain">${title || "Untitled entry"}</h2>
        <p class="text-sm text-muted">Start writing to see your rendered markdown here.</p>
      </div>
    `;
  }

  const escaped = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const lines = escaped.split(/\n/);
  const html: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  const renderInline = (value: string) =>
    value
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      return;
    }

    if (/^#{1,3}\s+/.test(trimmed)) {
      closeList();
      const level = Math.min(3, trimmed.match(/^#+/)?.[0].length ?? 1);
      const content = renderInline(trimmed.replace(/^#{1,3}\s+/, ""));
      html.push(`<h${level}>${content}</h${level}>`);
      return;
    }

    if (/^>\s+/.test(trimmed)) {
      closeList();
      html.push(`<blockquote>${renderInline(trimmed.replace(/^>\s+/, ""))}</blockquote>`);
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${renderInline(trimmed.replace(/^[-*]\s+/, ""))}</li>`);
      return;
    }

    closeList();
    html.push(`<p>${renderInline(trimmed)}</p>`);
  });

  closeList();

  return `
    <div class="space-y-3">
      <p class="text-sm uppercase tracking-[0.24em] text-muted">Preview</p>
      <h2 class="text-2xl font-semibold text-porcelain">${title || "Untitled entry"}</h2>
      <div class="space-y-3 text-sm leading-7 text-muted-strong">${html.join("")}</div>
    </div>
  `;
}

export function DistractionFreeEditor({ userId, userName }: EditorProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("calm");
  const [tagsInput, setTagsInput] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

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

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      setSaveStatus("saving");
      const payload: StoredEntry = {
        title,
        content,
        mood,
        tagsInput,
        updatedAt: new Date().toISOString(),
      };

      window.localStorage.setItem(storageKey, JSON.stringify(payload));
      setLastSavedAt(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
      setSaveStatus("saved");
    }, 450);

    return () => window.clearTimeout(timer);
  }, [content, hydrated, mood, storageKey, tagsInput, title]);

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
    () => buildMarkdownPreview(title, deferredContent),
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

              <div className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-muted-strong">
                {saveStatus === "saving" && "Saving…"}
                {saveStatus === "saved" && `Autosaved • ${lastSavedAt ?? "just now"}`}
                {saveStatus === "idle" && "Ready to save"}
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

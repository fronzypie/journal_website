"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnchorButton, Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/features/journal/components/reveal";
import { renderJournalMarkdown } from "@/lib/markdown";

type EntryData = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  mood: string;
  tags: string[];
  entry_date: string;
  word_count: number;
  reading_time_minutes: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  cover_image?: string;
};

type EntryDetailViewProps = {
  entry: EntryData;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const moodAccents: Record<string, { bg: string; text: string }> = {
  still: { bg: "bg-sage/16 border-sage/30", text: "text-sage" },
  clear: { bg: "bg-blue/16 border-blue/30", text: "text-blue" },
  tender: { bg: "bg-rose/16 border-rose/30", text: "text-rose" },
  restless: { bg: "bg-amber/16 border-amber/30", text: "text-amber" },
  bright: { bg: "bg-porcelain/14 border-white/32", text: "text-porcelain" },
  calm: { bg: "bg-sage/16 border-sage/30", text: "text-sage" },
  reflective: { bg: "bg-blue/16 border-blue/30", text: "text-blue" },
  hopeful: { bg: "bg-amber/16 border-amber/30", text: "text-amber" },
  introspective: { bg: "bg-rose/16 border-rose/30", text: "text-rose" },
};

export function EntryDetailView({ entry }: EntryDetailViewProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const accent = moodAccents[entry.mood] ?? moodAccents.calm;

  async function handleDelete() {
    if (!window.confirm("Delete this entry? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    const response = await fetch(`/api/entries/${entry.id}`, { method: "DELETE" });
    if (response.ok) {
      router.push("/dashboard");
    } else {
      setDeleting(false);
    }
  }

  const markdownHtml = renderJournalMarkdown(entry.content);

  return (
    <AppShell>
      <main className="py-6">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="ds-caption">Journal entry</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-none text-porcelain sm:text-7xl lg:text-8xl">
                {entry.title || "Untitled"}
              </h1>
              <p className="ds-text-body mt-4 text-sm">
                {formatDate(entry.entry_date || entry.created_at)}
              </p>
            </div>
            <Card className="p-5 sm:p-6" variant="elevated">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Mood", entry.mood.charAt(0).toUpperCase() + entry.mood.slice(1)],
                  ["Words", `${entry.word_count}`],
                  ["Read time", `${entry.reading_time_minutes} min`],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="ds-caption">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-porcelain">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-wrap items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5">
          <span className={`rounded-full border px-3 py-1 text-sm font-medium ${accent.text} ${accent.bg}`}>
            {entry.mood}
          </span>
          {entry.tags && entry.tags.length > 0 ? (
            entry.tags.map((tag) => (
              <span
                className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm text-muted-strong"
                key={tag}
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-sm text-muted">No tags</span>
          )}
          <span className="ml-auto text-xs text-muted">
            Updated {formatTime(entry.updated_at || entry.created_at)}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-6 sm:p-8" variant="elevated">
            <div
              className="prose prose-invert max-w-none text-lg leading-8 text-muted-strong [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:text-porcelain [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-porcelain [&_h3]:text-xl [&_h3]:font-medium [&_h3]:text-porcelain [&_p]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-amber [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-strong [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_strong]:text-porcelain"
              dangerouslySetInnerHTML={{ __html: markdownHtml }}
            />
          </Card>

          <div className="space-y-5">
            <Card className="p-5 sm:p-6" variant="frosted">
              <p className="ds-caption">Details</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Created</p>
                  <p className="mt-1 text-sm text-porcelain">{formatDate(entry.created_at)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Updated</p>
                  <p className="mt-1 text-sm text-porcelain">{formatDate(entry.updated_at || entry.created_at)}</p>
                </div>
                {entry.is_pinned ? (
                  <div className="rounded-2xl border border-amber/20 bg-amber/10 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-amber">Pinned entry</p>
                  </div>
                ) : null}
              </div>
            </Card>

            <Card className="p-5 sm:p-6" variant="quiet">
              <p className="ds-caption">Actions</p>
              <div className="mt-4 flex flex-col gap-3">
                <AnchorButton href={`/write`} variant="secondary">
                  Back to editor
                </AnchorButton>
                <AnchorButton href="/dashboard" variant="ghost">
                  Back to dashboard
                </AnchorButton>
                <Button disabled={deleting} onClick={handleDelete} variant="danger">
                  {deleting ? "Deleting..." : "Delete entry"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  );
}

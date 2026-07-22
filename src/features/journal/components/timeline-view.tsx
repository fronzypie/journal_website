"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AnchorButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/features/journal/components/reveal";
import { timelineMoodOptions, type TimelineMemory } from "@/features/journal/data/timeline-data";
import { motionEase } from "@/lib/motion";

type TimelineViewProps = {
  initialSearch?: string;
};

const pageSize = 4;
const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80";
const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function groupMemories(items: TimelineMemory[]) {
  const grouped: Record<string, Record<string, Record<string, TimelineMemory[]>>> = {};

  for (const item of items) {
    const yearBucket = grouped[item.year] ?? (grouped[item.year] = {});
    const monthBucket = yearBucket[item.month] ?? (yearBucket[item.month] = {});
    const dayBucket = monthBucket[item.day] ?? (monthBucket[item.day] = []);
    dayBucket.push(item);
  }

  return grouped;
}

function matchesSearch(memory: TimelineMemory, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    memory.title,
    memory.preview,
    memory.mood,
    memory.date,
    memory.tags.join(" "),
    memory.year,
    memory.month,
    memory.day,
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query.toLowerCase());
}

function getMonthIndex(month: string) {
  return monthOrder.indexOf(month as (typeof monthOrder)[number]);
}

function toTimelineMemory(entry: {
  content: string;
  cover_image?: string | null;
  entry_date: string;
  excerpt: string;
  id: string;
  mood: string;
  tags: string[] | null;
  title: string;
}) {
  const date = new Date(`${entry.entry_date}T00:00:00`);
  const month = monthOrder[date.getMonth()];

  return {
    id: entry.id,
    year: `${date.getFullYear()}`,
    month,
    day: `${date.getDate()}`.padStart(2, "0"),
    date: date.toLocaleDateString("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    title: entry.title || "Untitled entry",
    preview: entry.excerpt || entry.content.slice(0, 140),
    mood: (entry.mood as TimelineMemory["mood"]) || "still",
    tags: entry.tags ?? [],
    image: entry.cover_image || fallbackImage,
  } satisfies TimelineMemory;
}

function MemoryCard({ memory }: { memory: TimelineMemory }) {
  const reducedMotion = useReducedMotion();

  return (
    <Link href={`/entry/${memory.id}`} className="block focus:outline-none">
      <motion.article
        className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] shadow-soft"
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0 : 0.42, ease: motionEase }}
        whileHover={reducedMotion ? undefined : { y: -4 }}
      >
        <div className="grid gap-0 md:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-52 overflow-hidden">
            <Image
              alt={memory.title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 46vw"
              src={memory.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,9,0.05),rgba(7,8,9,0.68))]" />
            <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-porcelain backdrop-blur-md">
              Memory
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-white/72">{memory.date}</p>
                <p className="mt-1 text-xl font-medium text-porcelain">{memory.title}</p>
              </div>
              <div className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.18em] text-porcelain backdrop-blur-md">
                {memory.mood}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between p-5 sm:p-6">
            <div>
              <p className="ds-caption">Preview</p>
              <p className="mt-3 text-sm leading-7 text-muted-strong">{memory.preview}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {memory.tags.map((tag) => (
                <span
                  className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-xs text-muted-strong"
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}

export function TimelineView({ initialSearch = "" }: TimelineViewProps) {
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState(initialSearch);
  const [selectedMood, setSelectedMood] = useState<(typeof timelineMoodOptions)[number]["value"]>(
    "all",
  );
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [memories, setMemories] = useState<TimelineMemory[]>([]);
  const [loading, setLoading] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEntries() {
      const response = await fetch("/api/entries", { signal: controller.signal });
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const payload = (await response.json()) as { entries?: Array<{
        content: string;
        cover_image?: string | null;
        entry_date: string;
        excerpt: string;
        id: string;
        mood: string;
        tags: string[] | null;
        title: string;
      }> };
      setMemories((payload.entries ?? []).map(toTimelineMemory));
      setLoading(false);
    }

    void loadEntries();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) => Math.min(current + pageSize, memories.length));
        }
      },
      { rootMargin: "320px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [memories.length]);

  const years = useMemo(
    () => Array.from(new Set(memories.map((item) => item.year))).sort((a, b) => Number(b) - Number(a)),
    [memories],
  );

  const filteredMemories = useMemo(() => {
    return memories.filter((memory) => {
      const searchMatch = matchesSearch(memory, deferredQuery);
      const moodMatch = selectedMood === "all" || memory.mood === selectedMood;
      const yearMatch = selectedYear === "all" || memory.year === selectedYear;
      return searchMatch && moodMatch && yearMatch;
    });
  }, [deferredQuery, memories, selectedMood, selectedYear]);

  const clampedVisibleCount = Math.min(visibleCount, filteredMemories.length || pageSize);

  const visibleMemories = useMemo(
    () => filteredMemories.slice(0, clampedVisibleCount),
    [clampedVisibleCount, filteredMemories],
  );

  const grouped = useMemo(() => groupMemories(visibleMemories), [visibleMemories]);
  const yearGroups = useMemo(
    () => Object.keys(grouped).sort((a, b) => Number(b) - Number(a)),
    [grouped],
  );

  const totalCount = filteredMemories.length;

  return (
    <AppShell>
      <main className="relative">
        <section className="relative overflow-hidden py-6">
          <Reveal>
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="ds-caption">Timeline</p>
                <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-none text-porcelain sm:text-7xl lg:text-8xl">
                  Memories arranged by the way they stayed with you.
                </h1>
                  <p className="ds-text-body mt-6 max-w-2xl text-lg sm:text-xl">
                  Browse moments as lived memory, grouped by year, month, and day.
                  Search what lingered, filter by mood, and keep scrolling as the archive opens.
                </p>
              </div>

              <Card className="p-5 sm:p-6" variant="elevated">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ["Memories", `${memories.length}`],
                    ["Visible", `${totalCount}`],
                    ["Years", `${years.length}`],
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

          <div className="mt-8 grid gap-3 lg:grid-cols-[1.35fr_0.65fr]">
            <label className="block">
              <span className="sr-only">Search memories</span>
              <input
                aria-label="Search memories"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-porcelain outline-none placeholder:text-muted"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search memories, moods, tags, or dates"
                value={query}
              />
            </label>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {timelineMoodOptions.map((option) => (
                <button
                  aria-pressed={selectedMood === option.value}
                  className={`ds-transition shrink-0 rounded-full border px-4 py-3 text-sm ${selectedMood === option.value ? "border-white/20 bg-white/12 text-porcelain" : "border-white/10 bg-white/[0.03] text-muted-strong hover:border-white/16 hover:text-porcelain"}`}
                  key={option.value}
                  onClick={() => setSelectedMood(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
            <button
              aria-pressed={selectedYear === "all"}
              className={`ds-transition shrink-0 rounded-full border px-4 py-2 text-sm ${selectedYear === "all" ? "border-white/20 bg-white/12 text-porcelain" : "border-white/10 bg-white/[0.03] text-muted-strong hover:border-white/16 hover:text-porcelain"}`}
              onClick={() => setSelectedYear("all")}
              type="button"
            >
              All years
            </button>
            {years.map((year) => (
              <button
                aria-pressed={selectedYear === year}
                className={`ds-transition shrink-0 rounded-full border px-4 py-2 text-sm ${selectedYear === year ? "border-white/20 bg-white/12 text-porcelain" : "border-white/10 bg-white/[0.03] text-muted-strong hover:border-white/16 hover:text-porcelain"}`}
                key={year}
                onClick={() => setSelectedYear(year)}
                type="button"
              >
                {year}
              </button>
            ))}
          </div>
        </section>

        {loading ? (
          <Card className="mt-8 p-8 text-center" variant="quiet">
            <p className="text-xl font-semibold text-porcelain">Loading your timeline…</p>
            <p className="ds-text-body mt-2 text-sm">Fetching your journal entries from Supabase.</p>
          </Card>
        ) : null}

        <section className="pb-16 pt-8">
          {yearGroups.length > 0 ? (
            <div className="space-y-10">
              {yearGroups.map((year, yearIndex) => {
                const yearMonths = Object.keys(grouped[year] ?? {}).sort(
                  (left, right) => getMonthIndex(right) - getMonthIndex(left),
                );

                return (
                  <motion.section
                    animate={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                    className="space-y-6"
                    initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                    key={year}
                    transition={{
                      delay: reducedMotion ? 0 : yearIndex * 0.08,
                      duration: reducedMotion ? 0 : 0.5,
                      ease: motionEase,
                    }}
                  >
                    <div className="sticky top-4 z-10 rounded-[1.25rem] border border-white/10 bg-background/70 px-5 py-4 backdrop-blur-2xl">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="ds-caption">Year</p>
                          <h2 className="mt-1 text-3xl font-semibold text-porcelain">{year}</h2>
                        </div>
                        <p className="text-sm text-muted-strong">
                          {Object.values(grouped[year]).flatMap((month) =>
                            Object.values(month).flat(),
                          ).length} memories
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8 pl-0 md:pl-6">
                      {yearMonths.map((month) => {
                        const monthGroups = grouped[year]?.[month] ?? {};
                        const days = Object.keys(monthGroups).sort((left, right) => Number(right) - Number(left));

                        return (
                          <div className="space-y-4" key={`${year}-${month}`}>
                            <div className="flex items-center gap-4">
                              <div className="h-px flex-1 bg-white/10" />
                              <h3 className="text-xl font-medium text-porcelain">{month}</h3>
                              <div className="h-px flex-1 bg-white/10" />
                            </div>

                            <div className="space-y-4">
                              {days.map((day) => {
                                const memories = monthGroups[day] ?? [];

                                return (
                                  <div className="space-y-3" key={`${year}-${month}-${day}`}>
                                    <div className="flex items-center gap-4 pl-1 text-sm text-muted-strong">
                                      <span className="text-2xl font-semibold text-porcelain">{day}</span>
                                      <span>{memories[0]?.date ?? ""}</span>
                                    </div>

                                    <div className="grid gap-4">
                                      {memories.map((memory) => (
                                        <Reveal delay={reducedMotion ? 0 : 0.04} key={memory.id}>
                                          <MemoryCard memory={memory} />
                                        </Reveal>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.section>
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center" variant="quiet">
              <p className="text-2xl font-semibold text-porcelain">No memories matched your search.</p>
              <p className="ds-text-body mt-3 text-sm">
                Try a different mood, year, or keyword to open a different part of the archive.
              </p>
            </Card>
          )}

          <div ref={loadMoreRef} className="h-10" />

          {visibleCount < filteredMemories.length ? (
            <div className="mt-2 flex justify-center pb-6">
              <div className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-muted-strong">
                Loading more memories…
              </div>
            </div>
          ) : null}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-strong">
              {filteredMemories.length} memories in view. Infinite scroll keeps extending the archive.
            </p>
            <AnchorButton href="/write" variant="secondary">
              Write a new memory
            </AnchorButton>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

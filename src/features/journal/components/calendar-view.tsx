"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { AnchorButton, Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/features/journal/components/reveal";
import type { CalendarEntry } from "@/features/journal/data/calendar-data";
import { motionEase } from "@/lib/motion";

const monthNames = [
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

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80";

const moodStyles: Record<CalendarEntry["mood"], { bg: string; text: string; ring: string }> = {
  clear: {
    bg: "bg-blue/18",
    text: "text-blue",
    ring: "ring-blue/40",
  },
  still: {
    bg: "bg-sage/18",
    text: "text-sage",
    ring: "ring-sage/40",
  },
  tender: {
    bg: "bg-rose/16",
    text: "text-rose",
    ring: "ring-rose/40",
  },
  restless: {
    bg: "bg-amber/18",
    text: "text-amber",
    ring: "ring-amber/40",
  },
  bright: {
    bg: "bg-porcelain/14",
    text: "text-porcelain",
    ring: "ring-white/32",
  },
};

type CalendarMonth = {
  cells: Array<Date | null>;
  label: string;
  monthIndex: number;
  year: number;
};

const emptyMonth: CalendarMonth = {
  cells: [],
  label: "No entries yet",
  monthIndex: 0,
  year: new Date().getFullYear(),
};

type DayBucket = {
  entries: CalendarEntry[];
  count: number;
  primary: CalendarEntry;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

function toCalendarEntry(entry: {
  content: string;
  cover_image?: string | null;
  entry_date: string;
  excerpt: string;
  id: string;
  mood: string;
  tags: string[] | null;
  title: string;
}) {
  return {
    id: entry.id,
    date: entry.entry_date,
    title: entry.title || "Untitled entry",
    mood: (entry.mood as CalendarEntry["mood"]) || "still",
    preview: entry.excerpt || entry.content.slice(0, 120),
    body: entry.content || entry.excerpt || "",
    image: entry.cover_image || fallbackImage,
  } satisfies CalendarEntry;
}

function formatHeaderDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`).toLocaleDateString("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function createMonthGrid(year: number, monthIndex: number) {
  const firstOfMonth = new Date(year, monthIndex, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<Date | null> = [];

  for (let index = 0; index < startOffset; index += 1) {
    cells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, monthIndex, day));
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function groupEntriesForMonth(entries: CalendarEntry[], year: number, monthIndex: number) {
  const grouped = new Map<string, DayBucket>();

  for (const entry of entries) {
    const entryDate = parseDateKey(entry.date);
    if (entryDate.getFullYear() !== year || entryDate.getMonth() !== monthIndex) {
      continue;
    }

    const bucket = grouped.get(entry.date);
    if (bucket) {
      bucket.entries.push(entry);
      bucket.count += 1;
      continue;
    }

    grouped.set(entry.date, {
      count: 1,
      entries: [entry],
      primary: entry,
    });
  }

  return grouped;
}

function getCalendarMonths(entries: CalendarEntry[]) {
  if (entries.length === 0) {
    return [];
  }

  const dates = entries.map((entry) => parseDateKey(entry.date));
  const earliest = new Date(Math.min(...dates.map((date) => date.getTime())));
  const latest = new Date(Math.max(...dates.map((date) => date.getTime())));
  const months: CalendarMonth[] = [];

  let currentYear = latest.getFullYear();
  let currentMonth = latest.getMonth();

  while (
    currentYear > earliest.getFullYear() ||
    (currentYear === earliest.getFullYear() && currentMonth >= earliest.getMonth())
  ) {
    months.push({
      cells: createMonthGrid(currentYear, currentMonth),
      label: `${monthNames[currentMonth]} ${currentYear}`,
      monthIndex: currentMonth,
      year: currentYear,
    });

    currentMonth -= 1;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear -= 1;
    }
  }

  return months;
}

const DayCell = memo(function DayCell({
  day,
  bucket,
  isActive,
  isSelected,
  onSelect,
}: {
  day: Date;
  bucket?: DayBucket;
  isActive: boolean;
  isSelected: boolean;
  onSelect: (dateKey: string) => void;
}) {
  const reducedMotion = useReducedMotion();
  const dateKey = toDateKey(day);
  const entry = bucket?.primary;
  const mood = entry?.mood;
  const moodStyle = mood ? moodStyles[mood] : moodStyles.still;

  return (
    <motion.button
      aria-pressed={isSelected}
      className={`group relative flex min-h-36 flex-col justify-between overflow-hidden rounded-[1.25rem] border p-3 text-left transition-transform duration-300 focus:outline-none ${isSelected ? "border-white/22 bg-white/[0.08] shadow-glow" : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.05]"}`}
      onClick={() => onSelect(dateKey)}
      type="button"
      whileHover={reducedMotion ? undefined : { y: -3 }}
      whileTap={reducedMotion ? undefined : { scale: 0.99 }}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${bucket ? moodStyle.bg : "bg-white/8"}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-muted">{weekdayLabels[day.getDay()]}</p>
          <p className={`mt-2 text-2xl font-semibold ${isActive ? "text-porcelain" : "text-muted-strong"}`}>
            {day.getDate()}
          </p>
        </div>
        {bucket ? (
          <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${moodStyle.text} ${moodStyle.bg} ${moodStyle.ring}`}>
            {bucket.count}
          </span>
        ) : (
          <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-xs text-muted">0</span>
        )}
      </div>

      <div className="mt-5 flex-1 rounded-xl border border-dashed border-white/10 bg-black/10 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-[0.18em] text-muted">Mood color</span>
          {bucket ? <span className={`h-2.5 w-2.5 rounded-full ${moodStyle.bg}`} /> : null}
        </div>
        {bucket ? (
          <div className="mt-3 space-y-2">
            <p className="line-clamp-2 text-sm font-medium leading-6 text-porcelain">{entry?.title}</p>
            <p className="text-xs leading-5 text-muted-strong opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {entry?.preview}
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-6 text-muted">No entries yet.</p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-strong">
        <span>{bucket ? `${bucket.count} entr${bucket.count === 1 ? "y" : "ies"}` : "Quiet day"}</span>
        <span className="ds-transition group-hover:text-porcelain">Open entry</span>
      </div>
    </motion.button>
  );
});

const DetailPanel = memo(function DetailPanel({
  dateKey,
  bucket,
}: {
  dateKey: string | null;
  bucket: DayBucket | null;
}) {
  const reducedMotion = useReducedMotion();

  if (!dateKey || !bucket) {
    return (
      <Card className="p-6 sm:p-7" variant="quiet">
        <p className="ds-caption">Entry details</p>
        <h2 className="mt-3 text-2xl font-semibold text-porcelain">Select a day to open a memory.</h2>
        <p className="ds-text-body mt-4 text-sm">
          Click any occupied day in the calendar to reveal the entry preview, image, and mood context.
        </p>
      </Card>
    );
  }

  const primary = bucket.primary;
  const style = moodStyles[primary.mood];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={dateKey}
        initial={reducedMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: reducedMotion ? 0 : 0.32, ease: motionEase }}
      >
        <Card className="overflow-hidden p-0" variant="elevated">
          <div className="relative min-h-64 overflow-hidden">
            <Image
              alt={primary.title}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 52vw"
              src={primary.image}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,9,0.05),rgba(7,8,9,0.72))]" />
            <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-porcelain backdrop-blur-md">
              Memory open
            </div>
            <div className="absolute bottom-5 left-5 right-5 space-y-2">
              <p className="text-sm text-white/72">{formatHeaderDate(primary.date)}</p>
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-porcelain sm:text-4xl">
                {primary.title}
              </h2>
            </div>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`rounded-full border px-3 py-1 text-sm font-medium ${style.text} ${style.bg} ${style.ring}`}>
                {primary.mood}
              </span>
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm text-muted-strong">
                {bucket.count} entry{bucket.count === 1 ? "" : "ies"}
              </span>
              <span className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm text-muted-strong">
                {dateKey}
              </span>
            </div>

            <p className="ds-text-body text-sm sm:text-base">{primary.body}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              {bucket.entries.map((entry) => (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" key={entry.id}>
                  <p className="text-sm font-medium text-porcelain">{entry.title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted-strong">{entry.preview}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
});

export function CalendarView() {
  const reducedMotion = useReducedMotion();
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const calendarMonths = useMemo(() => getCalendarMonths(entries), [entries]);

  const currentMonth = useMemo(
    () => calendarMonths[monthIndex] ?? calendarMonths[0] ?? emptyMonth,
    [calendarMonths, monthIndex],
  );
  const monthBuckets = useMemo(
    () => (currentMonth ? groupEntriesForMonth(entries, currentMonth.year, currentMonth.monthIndex) : new Map<string, DayBucket>()),
    [currentMonth, entries],
  );

  const firstEntryDate = useMemo(() => {
    const firstEntryDay = currentMonth.cells.find((cell) => cell && monthBuckets.has(toDateKey(cell)));
    return firstEntryDay ? toDateKey(firstEntryDay) : null;
  }, [currentMonth.cells, monthBuckets]);
  const effectiveSelectedDate =
    selectedDate && monthBuckets.has(selectedDate) ? selectedDate : firstEntryDate;
  const selectedBucket = effectiveSelectedDate ? monthBuckets.get(effectiveSelectedDate) ?? null : null;

  const previousMonth = useCallback(() => {
    setMonthIndex((current) => Math.min(current + 1, calendarMonths.length - 1));
  }, [calendarMonths.length]);

  const nextMonth = useCallback(() => {
    setMonthIndex((current) => Math.max(current - 1, 0));
  }, []);

  const selectDay = useCallback((dateKey: string) => {
    setSelectedDate(dateKey);
  }, []);

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

      setEntries((payload.entries ?? []).map(toCalendarEntry));
      setLoading(false);
    }

    void loadEntries();
    return () => controller.abort();
  }, []);

  return (
    <AppShell>
      <section className="relative py-6">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="ds-caption">Calendar</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-none text-porcelain sm:text-7xl lg:text-8xl">
                A month-by-month map of what you kept.
              </h1>
              <p className="ds-text-body mt-6 max-w-2xl text-lg sm:text-xl">
                Each day shows mood color, entry count, and a hover preview. Click any day to open the memory,
                then move through the archive with gentle month navigation.
              </p>
            </div>

            <Card className="p-5 sm:p-6" variant="elevated">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="ds-caption">Archive span</p>
                    <p className="mt-2 text-2xl font-semibold text-porcelain">
                    {calendarMonths.length > 0
                      ? `${monthNames[calendarMonths[calendarMonths.length - 1].monthIndex]} ${calendarMonths[calendarMonths.length - 1].year}`
                      : "No entries yet"}
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-muted-strong">
                  {entries.length} memories
                  </div>
                </div>
              </Card>
          </div>
        </Reveal>

        <div className="mt-8 flex flex-col gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="ds-caption">Month navigation</p>
            <h2 className="mt-2 text-2xl font-semibold text-porcelain">{currentMonth.label}</h2>
          </div>

          <div className="flex items-center gap-3">
            <Button disabled={monthIndex === calendarMonths.length - 1} onClick={previousMonth} variant="secondary">
              Previous month
            </Button>
            <Button disabled={monthIndex === 0} onClick={nextMonth} variant="secondary">
              Next month
            </Button>
            <AnchorButton href="/timeline" variant="ghost">
              View timeline
            </AnchorButton>
          </div>
        </div>
        </section>

        {loading ? (
          <Card className="mt-8 p-8 text-center" variant="quiet">
            <p className="text-xl font-semibold text-porcelain">Loading your calendar…</p>
            <p className="ds-text-body mt-2 text-sm">Fetching your journal entries from Supabase.</p>
          </Card>
        ) : null}

      <section className="grid gap-6 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="p-4 sm:p-5" variant="quiet">
            <div className="grid grid-cols-7 gap-2 pb-3 text-center text-xs uppercase tracking-[0.22em] text-muted">
              {weekdayLabels.map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>

            {currentMonth ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMonth.label}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-7 gap-2"
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  transition={{ duration: reducedMotion ? 0 : 0.4, ease: motionEase }}
                >
                  {currentMonth.cells.map((day, index) => {
                    if (!day) {
                      return <div className="min-h-36 rounded-[1.25rem] border border-transparent" key={`empty-${index}`} />;
                    }

                    const dateKey = toDateKey(day);
                    return (
                      <DayCell
                        bucket={monthBuckets.get(dateKey)}
                        day={day}
                        isActive={day.getMonth() === currentMonth.monthIndex}
                        isSelected={effectiveSelectedDate === dateKey}
                        key={dateKey}
                        onSelect={selectDay}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="py-10 text-center text-sm text-muted">No entries yet.</div>
            )}
          </Card>

        <div className="space-y-4">
          <DetailPanel bucket={selectedBucket} dateKey={effectiveSelectedDate} />
          <Card className="p-5 sm:p-6" variant="quiet">
            <p className="ds-caption">Legend</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(moodStyles).map(([mood, style]) => (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 p-3" key={mood}>
                  <span className={`h-3.5 w-3.5 rounded-full ${style.bg}`} />
                  <div>
                    <p className="text-sm font-medium capitalize text-porcelain">{mood}</p>
                    <p className="text-xs text-muted">Mood color</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

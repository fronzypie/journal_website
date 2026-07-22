"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { AnchorButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type DashboardEntry = {
  id: string;
  entryDate: string;
  mood: string;
  readingTimeMinutes: number;
  title: string;
  updatedAt: string;
  isPinned: boolean;
};

type DashboardCollection = {
  id: string;
  name: string;
  itemCount?: number;
};

type DashboardViewProps = {
  displayDate: string;
  greeting: string;
  streak: number;
  collections: DashboardCollection[];
  favoriteEntries: DashboardEntry[];
  recentEntries: DashboardEntry[];
  activity: Array<{ detail: string; title: string }>;
  userName: string;
};

function formatActivityDate(dateString: string) {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export function DashboardView({
  displayDate,
  greeting,
  activity,
  collections,
  favoriteEntries,
  recentEntries,
  streak,
  userName,
}: DashboardViewProps) {
  const reducedMotion = useReducedMotion();

  const fadeIn = reducedMotion
    ? undefined
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
      };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <motion.section
          className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] p-8 shadow-elevated backdrop-blur-2xl sm:p-10"
          transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={reducedMotion ? undefined : { y: -4, scale: 1.01 }}
          {...fadeIn}
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="ds-caption">Journal dashboard</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-porcelain sm:text-5xl">
                {greeting}, {userName}
              </h1>
              <p className="ds-text-body mt-4 text-base sm:text-lg">
                Your private space is ready for a quiet entry, a thoughtful look
                back, or a gentle reset.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4 backdrop-blur-xl">
              <p className="ds-caption">Today</p>
              <p className="mt-2 text-xl font-medium text-porcelain">{displayDate}</p>
              <p className="mt-3 text-sm text-muted">
                Current streak <span className="font-medium text-porcelain">{streak} days</span>
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <AnchorButton href="/write">New entry</AnchorButton>
            <AnchorButton href="#quick-write" variant="secondary">
              Review entries
            </AnchorButton>
          </div>
        </motion.section>

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <motion.div
            id="quick-write"
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: 0.08 }}
            {...fadeIn}
          >
            <Card className="h-full p-6 sm:p-7" variant="elevated">
              <div className="flex items-center justify-between">
                <div>
                  <p className="ds-caption">Recent entries</p>
                  <h2 className="mt-2 text-2xl font-semibold text-porcelain">
                    A steady trail of reflection
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-1 text-sm text-muted">
                  3 new
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {recentEntries.map((entry) => (
                  <Link
                    href={`/entry/${entry.id}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition-colors hover:bg-white/[0.06]"
                    key={entry.id}
                  >
                    <p className="font-medium text-porcelain">{entry.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      {entry.mood} • {entry.readingTimeMinutes} min read
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: 0.12 }}
            {...fadeIn}
          >
            <Card className="h-full p-6 sm:p-7" variant="frosted">
              <p className="ds-caption">Favorite entries</p>
              <h2 className="mt-2 text-2xl font-semibold text-porcelain">
                Notes worth returning to
              </h2>

              <div className="mt-6 space-y-3">
                {favoriteEntries.map((entry) => (
                  <Link
                    href={`/entry/${entry.id}`}
                    className="block rounded-2xl border border-white/10 bg-black/10 p-4 transition-colors hover:bg-white/[0.04]"
                    key={entry.id}
                  >
                    <p className="font-medium text-porcelain">{entry.title}</p>
                    <p className="mt-1 text-sm text-muted">
                      Pinned entry • updated {formatActivityDate(entry.updatedAt)}
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <motion.div
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: 0.16 }}
            {...fadeIn}
          >
            <Card className="p-6 sm:p-7" variant="quiet">
              <p className="ds-caption">Collections</p>
              <h2 className="mt-2 text-2xl font-semibold text-porcelain">
                Curated spaces for different moods
              </h2>

              <div className="mt-6 flex flex-wrap gap-2">
                {collections.map((collection) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-sm text-muted-strong"
                    key={collection.id}
                  >
                    {collection.name}
                  </span>
                ))}
              </div>

              <div className="mt-6">
                <AnchorButton href="/collections" variant="secondary">
                  Open collections
                </AnchorButton>
              </div>
            </Card>
          </motion.div>

          <motion.div
            transition={{ duration: reducedMotion ? 0 : 0.45, delay: 0.2 }}
            {...fadeIn}
          >
            <Card className="p-6 sm:p-7" variant="outline">
              <p className="ds-caption">Recent activity</p>
              <h2 className="mt-2 text-2xl font-semibold text-porcelain">
                Quiet momentum, tracked gently
              </h2>

              <div className="mt-6 space-y-3">
                {activity.map((item) => (
                  <div
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    key={item.title}
                  >
                    <div>
                      <p className="font-medium text-porcelain">{item.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.detail}</p>
                    </div>
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-sage" />
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { motionEase } from "@/lib/motion";
import {
  searchDocuments,
  type SearchDocument,
} from "@/features/search/data/search-index";

function scoreDocument(document: SearchDocument, query: string) {
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
  if (document.title.toLowerCase().includes(normalized)) {
    score += 6;
  }
  if (document.collection?.toLowerCase().includes(normalized)) {
    score += 4;
  }
  if (document.tags.some((tag) => tag.toLowerCase().includes(normalized))) {
    score += 3;
  }
  if (document.mood?.toLowerCase().includes(normalized)) {
    score += 2;
  }
  if (document.date?.toLowerCase().includes(normalized)) {
    score += 2;
  }
  if (document.content.toLowerCase().includes(normalized)) {
    score += 1;
  }

  return score;
}

function formatResultLabel(document: SearchDocument) {
  if (document.kind === "collection") {
    return "Collection";
  }

  if (document.kind === "page") {
    return "Page";
  }

  return "Entry";
}

export function GlobalSearch() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setOpen(true);
        return;
      }

      if (!open) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const results = useMemo(() => {
    return searchDocuments
      .map((document) => ({ document, score: scoreDocument(document, query) }))
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || left.document.title.localeCompare(right.document.title))
      .map((item) => item.document);
  }, [query]);

  useEffect(() => {
    setActiveIndex((current) => {
      if (results.length === 0) {
        return 0;
      }

      return Math.min(current, results.length - 1);
    });
  }, [results.length]);

  const activeResult = results[activeIndex] ?? null;

  const openSearch = useCallback(() => {
    setOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const openResult = useCallback(
    (document: SearchDocument | null) => {
      if (!document) {
        return;
      }

      closeSearch();
      router.push(document.href);
    },
    [closeSearch, router],
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, Math.max(results.length - 1, 0)));
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        openResult(activeResult);
      }
    },
    [activeResult, openResult, results.length],
  );

  return (
    <>
      <button
        aria-label="Open global search"
        className="ds-focus-visible fixed bottom-5 right-5 z-40 inline-flex items-center gap-3 rounded-full border border-white/12 bg-background/80 px-4 py-3 text-sm text-porcelain shadow-elevated backdrop-blur-2xl transition-transform hover:-translate-y-0.5"
        onClick={openSearch}
        type="button"
      >
        <span className="text-muted-strong">Search</span>
        <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-muted-strong">
          Ctrl K
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/68 px-4 py-6 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.18 }}
            onMouseDown={closeSearch}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-6xl"
              exit={{ opacity: 0, y: 12, scale: 0.99 }}
              initial={{ opacity: 0, y: 12, scale: 0.99 }}
              onMouseDown={(event) => event.stopPropagation()}
              transition={{ duration: reducedMotion ? 0 : 0.24, ease: motionEase }}
            >
              <Card className="overflow-hidden p-0" variant="elevated">
                <div className="border-b border-white/10 p-4 sm:p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="ds-caption">Global search</p>
                      <h2 className="mt-2 text-2xl font-semibold text-porcelain">
                        Search title, content, tags, mood, collection, or date.
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-strong">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">Arrow keys</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">Enter</span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1">Escape</span>
                    </div>
                  </div>

                  <Input
                    ref={inputRef}
                    aria-label="Search all journal content"
                    className="mt-4 h-12"
                    onChange={(event) => setQuery(event.target.value)}
                    onKeyDown={handleInputKeyDown}
                    placeholder="Try 'clear', 'family', '2026-07-17', or 'college'"
                    value={query}
                  />
                </div>

                <div className="grid max-h-[72vh] gap-0 lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="border-b border-white/10 p-4 sm:p-5 lg:border-b-0 lg:border-r">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="ds-caption">Results</p>
                      <p className="text-sm text-muted-strong">{results.length} matches</p>
                    </div>

                    <div className="max-h-[58vh] space-y-3 overflow-y-auto pr-1">
                      {results.length > 0 ? (
                        results.map((document, index) => {
                          const isActive = index === activeIndex;
                          return (
                            <button
                              className={cn(
                                "w-full rounded-[1.25rem] border p-4 text-left transition-transform duration-200",
                                isActive
                                  ? "border-white/20 bg-white/[0.08] shadow-glow"
                                  : "border-white/10 bg-white/[0.03] hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.05]",
                              )}
                              key={document.id}
                              onClick={() => setActiveIndex(index)}
                              onMouseEnter={() => setActiveIndex(index)}
                              type="button"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="text-sm uppercase tracking-[0.2em] text-muted">{formatResultLabel(document)}</p>
                                  <h3 className="mt-2 text-lg font-medium text-porcelain">{document.title}</h3>
                                </div>
                                <div className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs text-muted-strong">
                                  {document.kind}
                                </div>
                              </div>

                              <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-strong">
                                {document.content}
                              </p>

                              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-strong">
                                {document.date ? (
                                  <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1">{document.date}</span>
                                ) : null}
                                {document.collection ? (
                                  <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1">{document.collection}</span>
                                ) : null}
                                {document.mood ? (
                                  <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 capitalize">{document.mood}</span>
                                ) : null}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <Card className="p-6 text-center" variant="quiet">
                          <p className="text-xl font-semibold text-porcelain">No matches found.</p>
                          <p className="ds-text-body mt-2 text-sm">
                            Try a different title, tag, date, or collection.
                          </p>
                        </Card>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-5">
                    <p className="ds-caption">Preview</p>
                    {activeResult ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeResult.id}
                          animate={{ opacity: 1, y: 0 }}
                          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: reducedMotion ? 0 : 0.24, ease: motionEase }}
                          className="mt-4 space-y-4"
                        >
                          {activeResult.image ? (
                            <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                              <Image
                                alt={activeResult.title}
                                className="h-56 w-full object-cover"
                                height={224}
                                width={896}
                                src={activeResult.image}
                              />
                            </div>
                          ) : null}

                          <div>
                            <h3 className="text-3xl font-semibold text-porcelain">
                              {activeResult.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-strong">
                              {activeResult.content}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {activeResult.date ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-muted-strong">
                                {activeResult.date}
                              </span>
                            ) : null}
                            {activeResult.collection ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-muted-strong">
                                {activeResult.collection}
                              </span>
                            ) : null}
                            {activeResult.mood ? (
                              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-muted-strong capitalize">
                                {activeResult.mood}
                              </span>
                            ) : null}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {activeResult.tags.map((tag) => (
                              <span
                                className="rounded-full border border-white/10 bg-black/10 px-3 py-1 text-sm text-muted-strong"
                                key={tag}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-3 pt-2">
                            <Button onClick={() => openResult(activeResult)}>Open</Button>
                            <Button onClick={closeSearch} variant="ghost">
                              Close
                            </Button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    ) : (
                      <Card className="mt-4 p-6" variant="quiet">
                        <p className="text-xl font-semibold text-porcelain">
                          Type to search the archive.
                        </p>
                        <p className="ds-text-body mt-2 text-sm">
                          Results are sorted instantly across titles, content, tags, mood, collections, and dates.
                        </p>
                      </Card>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

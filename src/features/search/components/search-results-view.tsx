"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/features/journal/components/reveal";
import type { SearchDocument } from "@/features/search/data/search-index";
import { formatSearchResultLabel, searchAndRankDocuments } from "@/features/search/data/search-utils";

export function SearchResultsView() {
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<SearchDocument[]>([]);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDocuments() {
      const response = await fetch("/api/search-documents", {
        signal: controller.signal,
      });
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { documents?: SearchDocument[] };
      setDocuments(payload.documents ?? []);
    }

    void loadDocuments();

    return () => controller.abort();
  }, []);

  const results = useMemo(() => {
    return searchAndRankDocuments(documents, deferredQuery);
  }, [deferredQuery, documents]);

  return (
    <AppShell>
      <section className="py-6">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="ds-caption">Search</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-none text-porcelain sm:text-7xl lg:text-8xl">
                Search the full archive.
              </h1>
              <p className="ds-text-body mt-6 max-w-2xl text-lg sm:text-xl">
                Find entries, collections, and pages by title, content, tags,
                mood, or date.
              </p>
            </div>
            <Card className="p-5 sm:p-6" variant="elevated">
              <p className="ds-caption">Everything indexed</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-muted-strong">
                  {documents.length} documents
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-muted-strong">
                  {results.length} matches
                </span>
              </div>
            </Card>
          </div>
        </Reveal>

        <div className="mt-8">
          <Input
            aria-label="Search journal content"
            className="h-12"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try 'clear', 'family', 'morning', or 'timeline'"
            value={query}
          />
        </div>

        <div className="mt-6 space-y-4 pb-16">
          {results.length > 0 ? (
            results.map((document) => (
              <a
                className="block rounded-[1.25rem] border border-white/10 bg-white/[0.035] p-5 transition-transform duration-300 hover:-translate-y-0.5 hover:border-white/16 hover:bg-white/[0.05] sm:p-6"
                href={document.href}
                key={document.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="ds-caption">{formatSearchResultLabel(document)}</p>
                    <h2 className="mt-2 text-xl font-medium text-porcelain">
                      {document.title}
                    </h2>
                  </div>
                </div>
                <p className="ds-text-body mt-3 line-clamp-2 text-sm">
                  {document.content}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-strong">
                  {document.date ? (
                    <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1">
                      {document.date}
                    </span>
                  ) : null}
                  {document.collection ? (
                    <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1">
                      {document.collection}
                    </span>
                  ) : null}
                  {document.mood ? (
                    <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 capitalize">
                      {document.mood}
                    </span>
                  ) : null}
                  {document.tags.slice(0, 3).map((tag) => (
                    <span
                      className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1"
                      key={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            ))
          ) : query.trim() ? (
            <Card className="p-8 text-center" variant="quiet">
              <p className="text-xl font-semibold text-porcelain">
                No matches found.
              </p>
              <p className="ds-text-body mt-2 text-sm">
                Try a different title, tag, date, or collection.
              </p>
            </Card>
          ) : (
            <Card className="p-8 text-center" variant="quiet">
              <p className="text-xl font-semibold text-porcelain">
                Type to search the archive.
              </p>
              <p className="ds-text-body mt-2 text-sm">
                Results update instantly across titles, content, tags, and moods.
              </p>
            </Card>
          )}
        </div>
      </section>
    </AppShell>
  );
}

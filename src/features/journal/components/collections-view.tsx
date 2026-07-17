"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Reveal } from "@/features/journal/components/reveal";
import {
  initialCollections,
  type JournalCollection,
} from "@/features/journal/data/collection-data";
import { motionEase } from "@/lib/motion";

type DraftState = {
  coverImage: string;
  name: string;
  summary: string;
  tone: string;
};

function getStorageKey(userId: string) {
  return `journal-collections:${userId}`;
}

const coverPresets = [
  "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
] as const;

function createId(name: string) {
  return `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${Date.now()}`;
}

function reorder(items: JournalCollection[], fromId: string, toId: string) {
  const sourceIndex = items.findIndex((item) => item.id === fromId);
  const targetIndex = items.findIndex((item) => item.id === toId);

  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) {
    return items;
  }

  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

function useCollectionsState(userId: string) {
  const storageKey = getStorageKey(userId);
  const [collections, setCollections] = useState<JournalCollection[]>(initialCollections);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as JournalCollection[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollections(parsed);
        }
      } catch {
        // Ignore malformed storage.
      }
    }

    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(collections));
  }, [collections, hydrated, storageKey]);

  return { collections, setCollections };
}

const CollectionCard = memo(function CollectionCard({
  collection,
  isDragging,
  isSelected,
  onDelete,
  onDragEnd,
  onDragOver,
  onDragStart,
  onDrop,
  onSelect,
}: {
  collection: JournalCollection;
  isDragging: boolean;
  isSelected: boolean;
  onDelete: (id: string) => void;
  onDragEnd: () => void;
  onDragOver: (id: string, event: any) => void;
  onDragStart: (id: string, event: any) => void;
  onDrop: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <motion.article
      className={`group overflow-hidden rounded-[1.5rem] border bg-white/[0.035] shadow-soft ${isSelected ? "border-white/20" : "border-white/10"}`}
      draggable
      onDragEnd={onDragEnd}
      onDragOver={(event) => onDragOver(collection.id, event)}
      onDragStart={(event) => onDragStart(collection.id, event)}
      onDrop={() => onDrop(collection.id)}
      style={{ opacity: isDragging ? 0.78 : 1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.99 }}
    >
      <button className="block w-full text-left" onClick={() => onSelect(collection.id)} type="button">
        <div className="relative min-h-56 overflow-hidden">
          <Image
            alt={collection.name}
            className="object-cover"
            fill
            sizes="(max-width: 768px) 100vw, 34vw"
            src={collection.coverImage}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,8,9,0.08),rgba(7,8,9,0.72))]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs font-medium uppercase tracking-[0.22em] text-porcelain backdrop-blur-md">
            Collection
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-sm text-white/72">{collection.tone}</p>
              <h3 className="mt-1 text-2xl font-semibold text-porcelain">{collection.name}</h3>
            </div>
            <div className="rounded-full border border-white/15 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.18em] text-porcelain backdrop-blur-md">
              {collection.itemCount}
            </div>
          </div>
        </div>
      </button>

      <div className="space-y-4 p-5 sm:p-6">
        <p className="ds-text-body text-sm leading-7">{collection.summary}</p>

        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => onSelect(collection.id)}>
            Open
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(collection.id)}>
            Delete
          </Button>
        </div>
      </div>
    </motion.article>
  );
});

export function CollectionsView({ userId }: { userId: string }) {
  const reducedMotion = useReducedMotion();
  const { collections, setCollections } = useCollectionsState(userId);
  const [selectedId, setSelectedId] = useState<string | null>(collections[0]?.id ?? null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftState>({
    coverImage: coverPresets[0],
    name: "",
    summary: "",
    tone: "",
  });

  useEffect(() => {
    if (!selectedId && collections[0]) {
      setSelectedId(collections[0].id);
    }
  }, [collections, selectedId]);

  const selectedCollection = useMemo(
    () => collections.find((collection) => collection.id === selectedId) ?? null,
    [collections, selectedId],
  );

  useEffect(() => {
    if (!selectedCollection) {
      return;
    }

    setDraft({
      coverImage: selectedCollection.coverImage,
      name: selectedCollection.name,
      summary: selectedCollection.summary,
      tone: selectedCollection.tone,
    });
  }, [selectedCollection]);

  const createCollection = useCallback(() => {
    if (!draft.name.trim()) {
      return;
    }

    const nextCollection: JournalCollection = {
      id: createId(draft.name),
      name: draft.name.trim(),
      summary: draft.summary.trim() || "A collection for the moments you want to keep close.",
      tone: draft.tone.trim() || "A new collection",
      itemCount: 0,
      coverImage: draft.coverImage.trim() || coverPresets[0],
    };

    setCollections((current) => [nextCollection, ...current]);
    setSelectedId(nextCollection.id);
  }, [draft.coverImage, draft.name, draft.summary, draft.tone, setCollections]);

  const renameSelected = useCallback(() => {
    if (!selectedCollection || !draft.name.trim()) {
      return;
    }

    setCollections((current) =>
      current.map((collection) =>
        collection.id === selectedCollection.id
          ? {
              ...collection,
              coverImage: draft.coverImage.trim() || collection.coverImage,
              name: draft.name.trim(),
              summary: draft.summary.trim() || collection.summary,
              tone: draft.tone.trim() || collection.tone,
            }
          : collection,
      ),
    );
  }, [draft.coverImage, draft.name, draft.summary, draft.tone, selectedCollection, setCollections]);

  const deleteCollection = useCallback(
    (id: string) => {
      setCollections((current) => current.filter((collection) => collection.id !== id));
      setSelectedId((current) => {
        if (current !== id) {
          return current;
        }
        return collections.find((collection) => collection.id !== id)?.id ?? null;
      });
    },
    [collections, setCollections],
  );

  const handleDrop = useCallback(
    (targetId: string) => {
      if (!draggingId || draggingId === targetId) {
        setDraggingId(null);
        return;
      }

      setCollections((current) => reorder(current, draggingId, targetId));
      setDraggingId(null);
    },
    [draggingId, setCollections],
  );

  const orderedCollections = useMemo(() => collections, [collections]);

  return (
    <AppShell>
      <section className="py-6">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="ds-caption">Collections</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-none text-porcelain sm:text-7xl lg:text-8xl">
                Shape your archive into living rooms of memory.
              </h1>
              <p className="ds-text-body mt-6 max-w-2xl text-lg sm:text-xl">
                Create, rename, delete, and rearrange collection spaces for the parts of your journal you keep returning to.
              </p>
            </div>

            <Card className="p-5 sm:p-6" variant="elevated">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["Collections", `${collections.length}`],
                  ["Visible cards", `${orderedCollections.length}`],
                  ["Active", selectedCollection?.name ?? "None"],
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
      </section>

      <section className="grid gap-6 pb-16 pt-2 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <Card className="p-5 sm:p-6" variant="quiet">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="ds-caption block">Name</label>
                <Input
                  className="mt-2"
                  onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Travel"
                  value={draft.name}
                />
              </div>
              <div>
                <label className="ds-caption block">Tone</label>
                <Input
                  className="mt-2"
                  onChange={(event) => setDraft((current) => ({ ...current, tone: event.target.value }))}
                  placeholder="Open skies and moving horizons"
                  value={draft.tone}
                />
              </div>
            </div>

            <label className="mt-4 block">
              <span className="ds-caption">Summary</span>
              <Textarea
                className="mt-2"
                onChange={(event) => setDraft((current) => ({ ...current, summary: event.target.value }))}
                placeholder="Describe what lives here..."
                value={draft.summary}
              />
            </label>

            <label className="mt-4 block">
              <span className="ds-caption">Cover image URL</span>
              <Input
                className="mt-2"
                onChange={(event) => setDraft((current) => ({ ...current, coverImage: event.target.value }))}
                placeholder="https://..."
                value={draft.coverImage}
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              {coverPresets.map((preset) => (
                <button
                  className="overflow-hidden rounded-2xl border border-white/10 transition-transform duration-300 hover:-translate-y-0.5"
                  key={preset}
                  onClick={() => setDraft((current) => ({ ...current, coverImage: preset }))}
                  type="button"
                >
                  <Image alt="Cover preset" className="h-16 w-24 object-cover" height={64} width={96} src={preset} />
                </button>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={createCollection}>Create</Button>
              <Button onClick={renameSelected} variant="secondary">
                Rename
              </Button>
              <Button
                onClick={() => selectedId && deleteCollection(selectedId)}
                variant="ghost"
              >
                Delete selected
              </Button>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {orderedCollections.map((collection) => (
              <CollectionCard
                collection={collection}
                isDragging={draggingId === collection.id}
                isSelected={selectedId === collection.id}
                key={collection.id}
                onDelete={deleteCollection}
                onDragEnd={() => setDraggingId(null)}
                onDragOver={(id, event) => {
                  event.preventDefault();
                  if (draggingId && draggingId !== id) {
                    event.dataTransfer.dropEffect = "move";
                  }
                }}
                onDragStart={(id, event) => {
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", id);
                  setDraggingId(id);
                }}
                onDrop={handleDrop}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <Card className="p-5 sm:p-6" variant="elevated">
            <p className="ds-caption">Selected collection</p>
            {selectedCollection ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCollection.id}
                  initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: reducedMotion ? 0 : 0.35, ease: motionEase }}
                  className="mt-4 space-y-4"
                >
                  <div className="overflow-hidden rounded-[1.5rem] border border-white/10">
                    <Image
                      alt={selectedCollection.name}
                      className="h-64 w-full object-cover"
                      height={256}
                      width={1024}
                      src={selectedCollection.coverImage}
                    />
                  </div>
                  <div>
                    <h2 className="text-3xl font-semibold text-porcelain">{selectedCollection.name}</h2>
                    <p className="mt-2 text-sm text-muted-strong">{selectedCollection.tone}</p>
                  </div>
                  <p className="ds-text-body text-sm">{selectedCollection.summary}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-muted-strong">
                      {selectedCollection.itemCount} entries
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-muted-strong">
                      Drag cards to reorder
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <p className="ds-text-body mt-4 text-sm">Create or select a collection to edit it here.</p>
            )}
          </Card>

          <Card className="p-5 sm:p-6" variant="quiet">
            <p className="ds-caption">How it works</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted-strong">
              <p>Create new collection spaces for themes like Travel, College, Family, Goals, and Dreams.</p>
              <p>Rename or delete a collection directly from the editor or the card grid.</p>
              <p>Drag cards across the grid to reorder the archive with smooth transitions.</p>
              <p>Assign a cover image by pasting a URL or choosing one of the presets.</p>
            </div>
          </Card>
        </div>
      </section>
    </AppShell>
  );
}

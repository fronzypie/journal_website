import { Card } from "@/components/ui/card";
import { recentEntries } from "@/features/journal/data/journal-data";
import { Reveal } from "@/features/journal/components/reveal";

const moodColors: Record<string, string> = {
  clear: "text-blue",
  still: "text-sage",
  tender: "text-rose",
  restless: "text-amber",
  bright: "text-porcelain",
};

export function RecentEntriesSection() {
  return (
    <section className="py-16" id="library">
      <Reveal>
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="ds-caption">Recent reflections</p>
            <h2 className="mt-3 text-4xl font-semibold leading-tight text-porcelain sm:text-5xl">
              Your inner life, held with care.
            </h2>
          </div>
          <p className="ds-text-body max-w-md text-sm">
            Entries surface by mood and meaning — not folders. A library that
            remembers how you felt, not just what you wrote.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-3">
        {recentEntries.map((entry, index) => (
          <Reveal delay={0.08 * index} key={entry.id}>
            <Card
              className="group h-full p-6 transition-transform duration-300 hover:-translate-y-0.5"
              variant={index === 1 ? "elevated" : "frosted"}
            >
              <div className="mb-6 flex items-center justify-between text-sm">
                <span className="text-muted">{entry.date}</span>
                <span
                  className={`font-medium capitalize ${moodColors[entry.mood] ?? "text-muted-strong"}`}
                >
                  {entry.mood}
                </span>
              </div>
              <h3 className="text-xl font-medium text-porcelain">{entry.title}</h3>
              <p className="ds-text-body mt-3 text-sm leading-7">{entry.excerpt}</p>
              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-muted">
                <span>{entry.wordCount} words</span>
                <span className="ds-transition text-muted-strong group-hover:text-porcelain">
                  Read entry
                </span>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

import { Reveal } from "@/features/journal/components/reveal";

const pillars = [
  "Private by design",
  "Autosave always on",
  "Ritual-first prompts",
  "Mood-aware library",
] as const;

export function TrustStrip() {
  return (
    <Reveal>
      <div className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-3 backdrop-blur-xl sm:px-6">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {pillars.map((item, index) => (
            <li
              className="flex items-center gap-6 text-sm text-muted-strong"
              key={item}
            >
              <span>{item}</span>
              {index < pillars.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden h-1 w-1 rounded-full bg-white/24 sm:block"
                />
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

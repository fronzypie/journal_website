import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

const palette = [
  ["Porcelain", "bg-porcelain", "#F7F4EE"],
  ["Graphite", "bg-graphite", "#111315"],
  ["Sage", "bg-sage", "#9BB7AA"],
  ["Blue", "bg-blue", "#9DB7D5"],
  ["Amber", "bg-amber", "#DFC783"],
  ["Rose", "bg-rose", "#D9A7A0"],
];

const radii = [
  ["XS", "rounded-xs"],
  ["SM", "rounded-sm"],
  ["MD", "rounded-md"],
  ["LG", "rounded-lg"],
  ["XL", "rounded-xl"],
];

export function DesignSystemShowcase() {
  return (
    <section className="pb-16" id="rituals">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="ds-caption">Design system</p>
          <h2 className="mt-3 text-3xl font-semibold text-porcelain">
            Calm primitives for a premium journal.
          </h2>
        </div>
        <p className="ds-text-body max-w-xl text-sm">
          Inspired by Apple HIG principles: clarity, depth, restraint, direct
          manipulation, and motion that supports orientation.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5" variant="elevated">
          <p className="ds-caption">Color palette</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {palette.map(([label, swatch, value]) => (
              <div
                className="rounded-md border border-white/10 p-3"
                key={label}
              >
                <div className={`h-16 rounded-sm ${swatch}`} />
                <p className="mt-3 text-sm font-medium text-porcelain">
                  {label}
                </p>
                <p className="mt-1 font-mono text-xs text-muted">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5" variant="frosted">
          <p className="ds-caption">Typography</p>
          <div className="mt-5 space-y-5">
            <div>
              <p className="ds-text-display text-4xl">
                Reflect with less noise.
              </p>
              <p className="mt-2 text-sm text-muted">Display / 650 / tight</p>
            </div>
            <div>
              <p className="text-xl font-medium text-porcelain">
                A heading should feel precise, quiet, and useful.
              </p>
              <p className="mt-2 text-sm text-muted">Title / 500 / balanced</p>
            </div>
            <p className="ds-text-body text-sm">
              Body copy uses generous line-height, muted contrast, and short
              measure so longer entries remain soft on the eyes.
            </p>
          </div>
        </Card>

        <Card className="p-5" variant="quiet">
          <p className="ds-caption">Buttons</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="quiet">Quiet</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </Card>

        <Card className="p-5" variant="outline">
          <p className="ds-caption">Inputs</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Input aria-label="Entry title" placeholder="Entry title" />
            <Input aria-label="Mood" placeholder="Mood" />
            <Textarea
              aria-label="Reflection"
              className="sm:col-span-2"
              placeholder="What feels true right now?"
            />
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2" variant="frosted">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <p className="ds-caption">Spacing</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Use a 4px base scale, then favor 16, 24, 32, 48, and 64px for
                calm rhythm between major surfaces.
              </p>
            </div>
            <div>
              <p className="ds-caption">Radius</p>
              <div className="mt-4 flex items-end gap-3">
                {radii.map(([label, radius]) => (
                  <div key={label}>
                    <div
                      className={`h-12 w-12 border border-white/14 ${radius}`}
                    />
                    <p className="mt-2 text-xs text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="ds-caption">Motion</p>
              <p className="mt-3 text-sm leading-6 text-muted">
                Use 160ms for tactile feedback, 240ms for component state, and
                520ms for scene-level reveals with emphasized easing.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}

import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function CollectionsLoading() {
  return (
    <AppShell>
      <section className="py-6">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-20 w-full max-w-4xl rounded-[1.5rem] bg-white/10" />
            <div className="h-6 w-full max-w-2xl rounded-full bg-white/10" />
          </div>
          <Card className="p-5 sm:p-6" variant="elevated">
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-14 rounded-2xl bg-white/10" />
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <Card className="h-80 animate-pulse p-5 sm:p-6" variant="quiet">
              <div />
            </Card>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-72 rounded-[1.5rem] bg-white/[0.035]" />
              ))}
            </div>
          </div>
          <div className="h-96 rounded-lg bg-white/8" />
        </div>
      </section>
    </AppShell>
  );
}
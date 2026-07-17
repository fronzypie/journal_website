import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function TimelineLoading() {
  return (
    <AppShell>
      <section className="py-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-4">
            <div className="h-4 w-20 rounded-full bg-white/10" />
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

        <div className="mt-8 h-12 rounded-2xl bg-white/[0.04]" />
        <div className="mt-3 flex gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-full bg-white/[0.04]" />
          ))}
        </div>

        <div className="mt-8 space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="h-16 rounded-[1.25rem] bg-white/[0.07]" />
              {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="h-40 rounded-[1.5rem] bg-white/[0.035]" />
              ))}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
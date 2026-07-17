import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function CalendarLoading() {
  return (
    <AppShell>
      <section className="py-6">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-4">
            <div className="h-4 w-20 rounded-full bg-white/10" />
            <div className="h-20 w-full max-w-4xl rounded-[1.5rem] bg-white/10" />
            <div className="h-6 w-full max-w-2xl rounded-full bg-white/10" />
          </div>
          <Card className="p-5 sm:p-6" variant="elevated">
            <div className="h-14 rounded-2xl bg-white/10" />
          </Card>
        </div>

        <div className="mt-8 h-16 rounded-[1.5rem] bg-white/[0.035]" />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="h-[32rem] animate-pulse p-4 sm:p-5" variant="quiet">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div className="min-h-36 rounded-[1.25rem] bg-white/8" key={i} />
              ))}
            </div>
          </Card>
          <div className="h-64 rounded-lg bg-white/8" />
        </div>
      </section>
    </AppShell>
  );
}
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <AppShell>
      <main className="py-6">
        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div className="space-y-4">
            <div className="h-4 w-24 rounded-full bg-white/10" />
            <div className="h-16 w-full max-w-4xl rounded-[1.5rem] bg-white/10" />
            <div className="h-6 w-full max-w-2xl rounded-full bg-white/10" />
          </div>
          <Card className="p-5 sm:p-6" variant="elevated">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="h-14 rounded-2xl bg-white/10" />
              <div className="h-14 rounded-2xl bg-white/10" />
              <div className="h-14 rounded-2xl bg-white/10" />
            </div>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="h-[28rem] animate-pulse p-6" variant="quiet">
            <div className="h-full rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.03]" />
          </Card>
          <Card className="h-[28rem] animate-pulse p-6" variant="frosted">
            <div className="h-full rounded-[1.25rem] border border-dashed border-white/10 bg-white/[0.03]" />
          </Card>
        </div>
      </main>
    </AppShell>
  );
}
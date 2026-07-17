import { AnchorButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <Card className="w-full p-8 text-center sm:p-10" variant="elevated">
          <p className="ds-caption">Not found</p>
          <h1 className="mt-3 text-3xl font-semibold text-porcelain sm:text-4xl">
            This page drifted off the map.
          </h1>
          <p className="ds-text-body mt-4 text-sm sm:text-base">
            Return to the journal or open the dashboard.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <AnchorButton href="/">Go home</AnchorButton>
            <AnchorButton href="/dashboard" variant="secondary">
              Dashboard
            </AnchorButton>
          </div>
        </Card>
      </div>
    </main>
  );
}
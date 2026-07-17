"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-4xl items-center justify-center">
        <Card className="w-full p-8 text-center sm:p-10" variant="elevated">
          <p className="ds-caption">Something went wrong</p>
          <h1 className="mt-3 text-3xl font-semibold text-porcelain sm:text-4xl">
            The journal paused unexpectedly.
          </h1>
          <p className="ds-text-body mt-4 text-sm sm:text-base">
            You can retry the page without losing your place.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Try again</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
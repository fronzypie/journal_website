import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(223,199,131,0.14),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(157,183,213,0.12),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(155,183,170,0.1),transparent_36%),linear-gradient(135deg,#070809_0%,#111315_52%,#171511_100%)]" />
      <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6">
        <Link
          className="ds-focus-visible ds-transition mb-8 text-sm font-medium tracking-[0.22em] text-muted-strong/86 uppercase hover:text-porcelain"
          href="/"
        >
          Aster Journal
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  );
}

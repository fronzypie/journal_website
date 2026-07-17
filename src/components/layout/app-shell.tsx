import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(223,199,131,0.16),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(157,183,213,0.14),transparent_28%),radial-gradient(circle_at_72%_88%,rgba(155,183,170,0.12),transparent_26%),linear-gradient(135deg,#070809_0%,#111315_48%,#171511_100%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="ds-container ds-page-pad relative flex min-h-screen flex-col py-6">
        {children}
      </div>
    </main>
  );
}

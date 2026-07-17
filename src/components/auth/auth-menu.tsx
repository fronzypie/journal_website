"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

type AuthMenuProps = {
  className?: string;
};

export function AuthMenu({ className }: AuthMenuProps) {
  const { loading, signOut, user } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <Link
        className="ds-focus-visible ds-transition rounded-full text-sm font-medium text-muted-strong hover:text-porcelain"
        href="/login"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`.trim()}>
      <Link
        className="ds-focus-visible ds-transition rounded-full text-sm font-medium text-muted-strong hover:text-porcelain"
        href="/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className="ds-focus-visible ds-transition rounded-full text-sm font-medium text-muted-strong hover:text-porcelain"
        href="/settings"
      >
        Settings
      </Link>
      <Button onClick={() => void signOut()} size="sm" variant="ghost">
        Logout
      </Button>
    </div>
  );
}

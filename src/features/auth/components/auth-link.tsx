import Link from "next/link";
import { cn } from "@/lib/cn";

type AuthLinkProps = {
  children: React.ReactNode;
  className?: string;
  href: string;
};

export function AuthLink({ children, className, href }: AuthLinkProps) {
  return (
    <Link
      className={cn(
        "ds-focus-visible ds-transition text-muted-strong hover:text-porcelain",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}

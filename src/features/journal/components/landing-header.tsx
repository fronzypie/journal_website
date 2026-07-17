"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AnchorButton } from "@/components/ui/button";
import { motionEase } from "@/lib/motion";

const navItems = [
  ["Features", "#features"],
  ["Preview", "#preview"],
  ["Library", "#library"],
  ["Stories", "#testimonials"],
  ["FAQ", "#faq"],
] as const;

export function LandingHeader() {
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="sticky top-0 z-30 -mx-3 sm:mx-0">
      <div className="flex items-center justify-between gap-4 rounded-full border border-white/8 bg-background/62 px-4 py-3 backdrop-blur-2xl">
        <a
          className="ds-focus-visible ds-transition rounded-full text-sm font-medium tracking-[0.22em] text-muted-strong/86 uppercase hover:text-porcelain"
          href="#top"
          onClick={() => setMenuOpen(false)}
        >
          Aster Journal
        </a>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-6 lg:flex"
        >
          {navItems.map(([label, href]) => (
            <a
              className="ds-transition text-sm text-muted hover:text-porcelain"
              href={href}
              key={label}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AnchorButton
            className="hidden sm:inline-flex"
            href="#preview"
            size="sm"
            variant="secondary"
          >
            Preview
          </AnchorButton>

          <button
            aria-controls="mobile-nav"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="ds-focus-visible ds-transition inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/8 text-porcelain hover:border-white/20 hover:bg-white/12 lg:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span className="relative block h-3.5 w-3.5">
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-200 ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-px w-full bg-current transition-opacity duration-200 ${menuOpen ? "opacity-0" : "opacity-100"}`}
              />
              <span
                className={`absolute left-0 block h-px w-full bg-current transition-transform duration-200 ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              aria-label="Close menu"
              className="fixed inset-0 z-40 bg-ink/72 backdrop-blur-sm lg:hidden"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
              type="button"
            />

            <motion.nav
              animate={{ opacity: 1, y: 0 }}
              aria-label="Mobile navigation"
              className="fixed inset-x-4 top-[4.75rem] z-50 overflow-hidden rounded-lg border border-white/12 bg-background/92 p-4 shadow-elevated backdrop-blur-2xl lg:hidden"
              exit={{ opacity: 0, y: -8 }}
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              transition={{
                duration: reducedMotion ? 0 : 0.24,
                ease: motionEase,
              }}
            >
              <ul className="space-y-1">
                {navItems.map(([label, href]) => (
                  <li key={label}>
                    <a
                      className="ds-focus-visible ds-transition block rounded-md px-3 py-3 text-base text-muted-strong hover:bg-white/8 hover:text-porcelain"
                      href={href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 border-t border-white/10 pt-4">
                <AnchorButton
                  className="w-full"
                  href="#preview"
                  onClick={() => setMenuOpen(false)}
                  size="md"
                >
                  Start with today
                </AnchorButton>
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

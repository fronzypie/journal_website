"use client";

import { useEffect } from "react";

const themeKey = "journal-theme";
const defaultTheme = "dark";

function applyTheme(theme: string) {
  document.documentElement.dataset.theme = theme;
}

export function ThemeSync() {
  useEffect(() => {
    const storedTheme = window.localStorage.getItem(themeKey) ?? defaultTheme;
    applyTheme(storedTheme);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === themeKey && event.newValue) {
        applyTheme(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return null;
}

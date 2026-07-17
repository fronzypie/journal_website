"use client";

import dynamic from "next/dynamic";

const GlobalSearch = dynamic(
  () => import("@/components/search/global-search").then((module) => module.GlobalSearch),
  {
    ssr: false,
  },
);

export function GlobalSearchLoader() {
  return <GlobalSearch />;
}

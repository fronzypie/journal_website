import type { MetadataRoute } from "next";

const routes = [
  "/",
  "/calendar",
  "/collections",
  "/dashboard",
  "/search",
  "/settings",
  "/timeline",
  "/write",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return routes.map((route) => ({
    url: new URL(route, baseUrl).toString(),
    lastModified: new Date(),
  }));
}
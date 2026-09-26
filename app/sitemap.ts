import type { MetadataRoute } from "next";
import { loadBoard } from "@/lib/board";
import { listingHref } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

const PAGES = ["/", "/jobs", "/about", "/design"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = PAGES.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" || path === "/jobs" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  const board = await loadBoard();
  if (board.status !== "ok") return entries;

  for (const job of board.jobs) {
    const stamp = job.postedAt ?? job.firstSeenAt;
    entries.push({
      url: absoluteUrl(listingHref(job)),
      lastModified: stamp ? new Date(stamp) : now,
      changeFrequency: "daily",
      priority: 0.5,
    });
  }

  return entries;
}

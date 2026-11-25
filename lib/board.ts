import { databaseMode } from "./db";
import { cachedRead } from "./data-cache";
import { freshCutoff, listListings, listListingsWithDescriptions, getIngestStats, getRoleCounts, recordRoleCount, type IngestStats } from "./listings";
import { listingTimestamp } from "./filters";
import { mockDataEnabled, mockListings } from "./mock-board";
import type { Listing } from "./types";

export type BoardState = {
  status: "ok" | "unconfigured" | "error";
  jobs: Listing[];
  message: string | null;
};

/**
 * Pages read through the six-hour cache in data-cache.ts, so a page view or a crawler normally
 * costs no database query. Detail pages are served from the same snapshot as the board.
 */
async function cachedListings(now = Date.now()): Promise<Listing[]> {
  const jobs = await cachedRead("listings", () => listListingsWithDescriptions(now), now);
  // Same 30-day rule as the SQL, re-applied so a cached snapshot never shows a role that aged out mid-window.
  const cutoff = freshCutoff(now);
  return jobs.filter((job) => (job.postedAt ?? job.firstSeenAt) >= cutoff);
}

export async function loadBoard(): Promise<BoardState> {
  if (mockDataEnabled()) {
    const jobs = databaseMode() === "unconfigured" ? [] : await listListings().catch(() => []);
    if (jobs.length === 0) return { status: "ok", jobs: mockListings(), message: null };
  }
  if (databaseMode() === "unconfigured") {
    return {
      status: "unconfigured",
      jobs: [],
      message: "This board isn’t connected to a database yet. Add DATABASE_URL and the daily ingest will fill it with design roles.",
    };
  }
  try {
    const jobs = (await cachedListings()).map((job) => ({ ...job, description: undefined }));
    return { status: "ok", jobs, message: null };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      jobs: [],
      message: "The database couldn’t be reached. Check DATABASE_URL and try again.",
    };
  }
}

/** Null when the database is unconfigured, unreachable, or no ingest has run yet. */
export async function loadIngestStats(): Promise<IngestStats | null> {
  if (mockDataEnabled()) {
    const real = databaseMode() === "unconfigured" ? null : await getIngestStats().catch(() => null);
    if (!real || Date.now() - Date.parse(real.ranAt) > 2 * DAY_MS) {
      return { freshAdded: 14, staleRemoved: 6, ranAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() };
    }
    return real;
  }
  if (databaseMode() === "unconfigured") return null;
  try {
    return await cachedRead("ingest-stats", () => getIngestStats());
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function loadListing(id: string): Promise<{ status: BoardState["status"]; job: Listing | null; message: string | null }> {
  if (mockDataEnabled() && id.includes(":mock-")) {
    return { status: "ok", job: mockListings().find((job) => job.id === id) ?? null, message: null };
  }
  if (databaseMode() === "unconfigured") {
    return {
      status: "unconfigured",
      job: null,
      message: "This board isn’t connected to a database yet. Add DATABASE_URL and the daily ingest will fill it with design roles.",
    };
  }
  try {
    const job = (await cachedListings()).find((listing) => listing.id === id) ?? null;
    return { status: "ok", job, message: null };
  } catch (error) {
    console.error(error);
    return { status: "error", job: null, message: "The database couldn’t be reached. Check DATABASE_URL and try again." };
  }
}

export type RoleTrendDay = {
  day: string;
  openRoles: number | null;
  isToday: boolean;
  /** True when no count was recorded that day and the value is estimated from today's listings. */
  estimated: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

const WINDOW_MS = 30 * DAY_MS;

/**
 * Estimate for a day with no recorded count: today's listings that were already posted by the end
 * of that day and still inside the 30-day window. Roles that have since closed aren't in the table,
 * so this reads low for older days.
 */
function estimateOpenRoles(jobs: Listing[], day: string): number {
  const end = Date.parse(`${day}T00:00:00Z`) + DAY_MS;
  return jobs.filter((job) => {
    const posted = listingTimestamp(job);
    return posted < end && end - posted <= WINDOW_MS;
  }).length;
}

/**
 * The last `days` UTC days of open-role counts, oldest first, ending with today at the live count.
 * Recorded counts are used where they exist; other days are estimated and flagged. Also fills today's
 * row if the ingest hasn't written one yet, so real history accrues from the first view.
 */
export async function loadRoleTrend(jobs: Listing[], days = 5, now = Date.now()): Promise<RoleTrendDay[] | null> {
  const todayCount = jobs.length;
  // Mock roles never touch the database: estimate the whole trend from them instead of recording counts.
  if (mockDataEnabled() && jobs.some((job) => job.externalId.startsWith("mock-"))) {
    return Array.from({ length: days }, (_, index) => {
      const day = new Date(now - (days - 1 - index) * DAY_MS).toISOString().slice(0, 10);
      const isToday = index === days - 1;
      return { day, openRoles: isToday ? todayCount : estimateOpenRoles(jobs, day), isToday, estimated: !isToday };
    });
  }
  if (databaseMode() === "unconfigured") return null;
  const keys = Array.from({ length: days }, (_, index) => new Date(now - (days - 1 - index) * DAY_MS).toISOString().slice(0, 10));
  const today = keys[keys.length - 1];
  try {
    const counts = new Map(
      (await cachedRead(`role-counts:${keys.join(",")}`, () => getRoleCounts(keys), now)).map((row) => [row.day, row.openRoles]),
    );
    // The ingest writes today's row; a view only fills it on days before that, once per cache window.
    if (!counts.has(today)) {
      await cachedRead(`role-count-fill:${today}`, async () => {
        await recordRoleCount(today, todayCount, new Date(now).toISOString(), false);
        return true;
      }, now);
    }
    return keys.map((day) => {
      if (day === today) return { day, openRoles: todayCount, isToday: true, estimated: false };
      const recorded = counts.get(day);
      return recorded == null
        ? { day, openRoles: estimateOpenRoles(jobs, day), isToday: false, estimated: true }
        : { day, openRoles: recorded, isToday: false, estimated: false };
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}

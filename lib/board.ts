import { databaseMode } from "./db";
import { listListings, getListing, getIngestStats, getRoleCounts, recordRoleCount, type IngestStats } from "./listings";
import type { Listing } from "./types";

export type BoardState = {
  status: "ok" | "unconfigured" | "error";
  jobs: Listing[];
  message: string | null;
};

export async function loadBoard(): Promise<BoardState> {
  if (databaseMode() === "unconfigured") {
    return {
      status: "unconfigured",
      jobs: [],
      message: "This board isn’t connected to a database yet. Add DATABASE_URL and the daily ingest will fill it with design roles.",
    };
  }
  try {
    const jobs = await listListings();
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
  if (databaseMode() === "unconfigured") return null;
  try {
    return await getIngestStats();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function loadListing(id: string): Promise<{ status: BoardState["status"]; job: Listing | null; message: string | null }> {
  if (databaseMode() === "unconfigured") {
    return {
      status: "unconfigured",
      job: null,
      message: "This board isn’t connected to a database yet. Add DATABASE_URL and the daily ingest will fill it with design roles.",
    };
  }
  try {
    const job = await getListing(id);
    return { status: "ok", job, message: null };
  } catch (error) {
    console.error(error);
    return { status: "error", job: null, message: "The database couldn’t be reached. Check DATABASE_URL and try again." };
  }
}

export type RoleTrendDay = { day: string; openRoles: number | null; isToday: boolean };

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The last `days` UTC days of open-role counts, oldest first, ending with today at the live count.
 * Days with no recorded count come back as null rather than a guess. Also fills today's row if the
 * ingest hasn't written one yet, so history starts accruing from the first view.
 */
export async function loadRoleTrend(todayCount: number, days = 5, now = Date.now()): Promise<RoleTrendDay[] | null> {
  if (databaseMode() === "unconfigured") return null;
  const keys = Array.from({ length: days }, (_, index) => new Date(now - (days - 1 - index) * DAY_MS).toISOString().slice(0, 10));
  const today = keys[keys.length - 1];
  try {
    await recordRoleCount(today, todayCount, new Date(now).toISOString(), false);
    const counts = new Map((await getRoleCounts(keys)).map((row) => [row.day, row.openRoles]));
    return keys.map((day) => ({
      day,
      openRoles: day === today ? todayCount : (counts.get(day) ?? null),
      isToday: day === today,
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}

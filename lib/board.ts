import { databaseMode } from "./db";
import { listListings, getListing, getIngestStats, type IngestStats } from "./listings";
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

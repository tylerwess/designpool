import { getDb, type SqlParam } from "./db";
import type { Listing, ListingDraft } from "./types";
import type { Ats, DisciplineId, EmploymentType, IndustryId, Seniority, SizeBucket, WorkType } from "./taxonomy";

/** Single source of truth for "nothing older than 30 days": both the cron sweep and every read use this. */
export const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function freshCutoff(now = Date.now()): string {
  return new Date(now - THIRTY_DAYS_MS).toISOString();
}

const LIST_COLUMNS = `
  id, source, external_id, company, company_token, title, url, location,
  remote_type, employment_type, salary_min, salary_max, salary_currency,
  salary_interval, posted_at, source_updated_at, first_seen_at, last_seen_at,
  seniority, stretch, years_min, years_max, industry, size_bucket, disciplines
`;

type ListingRow = {
  id: string;
  source: string;
  external_id: string;
  company: string;
  company_token: string;
  title: string;
  url: string;
  location: string | null;
  remote_type: string;
  employment_type: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  salary_interval: string | null;
  description?: string | null;
  posted_at: string | null;
  source_updated_at: string | null;
  first_seen_at: string;
  last_seen_at: string;
  seniority: string;
  stretch: number | boolean;
  years_min: number | null;
  years_max: number | null;
  industry: string;
  size_bucket: string;
  disciplines: string;
};

function mapRow(row: ListingRow): Listing {
  let disciplines: DisciplineId[] = [];
  try {
    const parsed = JSON.parse(row.disciplines) as DisciplineId[];
    if (Array.isArray(parsed)) disciplines = parsed;
  } catch {
    disciplines = [];
  }
  return {
    id: row.id,
    source: row.source as Ats,
    externalId: row.external_id,
    company: row.company,
    companyToken: row.company_token,
    title: row.title,
    url: row.url,
    location: row.location,
    remoteType: row.remote_type as WorkType,
    employmentType: row.employment_type as EmploymentType,
    salaryMin: row.salary_min == null ? null : Number(row.salary_min),
    salaryMax: row.salary_max == null ? null : Number(row.salary_max),
    salaryCurrency: row.salary_currency,
    salaryInterval: row.salary_interval,
    description: row.description ?? undefined,
    postedAt: row.posted_at,
    sourceUpdatedAt: row.source_updated_at,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    seniority: row.seniority as Seniority,
    stretch: row.stretch === true || Number(row.stretch) === 1,
    yearsMin: row.years_min == null ? null : Number(row.years_min),
    yearsMax: row.years_max == null ? null : Number(row.years_max),
    industry: row.industry as IndustryId,
    sizeBucket: row.size_bucket as SizeBucket,
    disciplines,
  };
}

/**
 * Belt-and-suspenders: even if a cron run is late or fails, no page ever
 * serves a listing older than 30 days. The physical DELETE in deleteExpired
 * is what actually reclaims space; this WHERE clause is what guarantees
 * nothing stale is ever displayed in the meantime.
 */
export async function listListings(now = Date.now()): Promise<Listing[]> {
  const db = await getDb();
  const rows = await db.all<ListingRow>(
    `SELECT ${LIST_COLUMNS} FROM listings WHERE COALESCE(posted_at, first_seen_at) >= ?`,
    [freshCutoff(now)],
  );
  return rows.map(mapRow);
}

export async function getListing(id: string, now = Date.now()): Promise<Listing | null> {
  const db = await getDb();
  const rows = await db.all<ListingRow>(
    `SELECT ${LIST_COLUMNS}, description FROM listings WHERE id = ? AND COALESCE(posted_at, first_seen_at) >= ?`,
    [id, freshCutoff(now)],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function upsertListing(listing: ListingDraft): Promise<void> {
  const db = await getDb();
  const params: SqlParam[] = [
    listing.id,
    listing.source,
    listing.externalId,
    listing.company,
    listing.companyToken,
    listing.title,
    listing.url,
    listing.location,
    listing.remoteType,
    listing.employmentType,
    listing.salaryMin,
    listing.salaryMax,
    listing.salaryCurrency,
    listing.salaryInterval,
    listing.description,
    listing.postedAt,
    listing.sourceUpdatedAt,
    listing.firstSeenAt,
    listing.lastSeenAt,
    listing.seniority,
    listing.stretch ? 1 : 0,
    listing.yearsMin,
    listing.yearsMax,
    listing.industry,
    listing.sizeBucket,
    JSON.stringify(listing.disciplines),
  ];
  await db.run(
    `INSERT INTO listings (
      id, source, external_id, company, company_token, title, url, location,
      remote_type, employment_type, salary_min, salary_max, salary_currency,
      salary_interval, description, posted_at, source_updated_at, first_seen_at,
      last_seen_at, seniority, stretch, years_min, years_max, industry,
      size_bucket, disciplines
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET
      company = excluded.company,
      company_token = excluded.company_token,
      title = excluded.title,
      url = excluded.url,
      location = excluded.location,
      remote_type = excluded.remote_type,
      employment_type = excluded.employment_type,
      salary_min = excluded.salary_min,
      salary_max = excluded.salary_max,
      salary_currency = excluded.salary_currency,
      salary_interval = excluded.salary_interval,
      description = excluded.description,
      posted_at = excluded.posted_at,
      source_updated_at = excluded.source_updated_at,
      last_seen_at = excluded.last_seen_at,
      seniority = excluded.seniority,
      stretch = excluded.stretch,
      years_min = excluded.years_min,
      years_max = excluded.years_max,
      industry = excluded.industry,
      size_bucket = excluded.size_bucket,
      disciplines = excluded.disciplines`,
    params,
  );
}

export async function deleteStale(source: string, token: string, seenAfter: string): Promise<number> {
  const db = await getDb();
  const rows = await db.all<{ id: string }>(
    `DELETE FROM listings WHERE source = ? AND company_token = ? AND last_seen_at < ? RETURNING id`,
    [source, token, seenAfter],
  );
  return rows.length;
}

export async function deleteExpired(cutoffIso: string): Promise<number> {
  const db = await getDb();
  const rows = await db.all<{ id: string }>(
    `DELETE FROM listings WHERE COALESCE(posted_at, first_seen_at) < ? RETURNING id`,
    [cutoffIso],
  );
  return rows.length;
}

export async function countBySeniority(): Promise<Record<string, number>> {
  const db = await getDb();
  const rows = await db.all<{ seniority: string; n: number | string }>(
    `SELECT seniority, COUNT(*) AS n FROM listings GROUP BY seniority`,
  );
  const counts: Record<string, number> = {};
  for (const row of rows) counts[row.seniority] = Number(row.n);
  return counts;
}

/** Listings whose first_seen_at was never touched by the upsert's DO UPDATE, so this is exactly this run's inserts. */
export async function countFirstSeenAt(seenAt: string): Promise<number> {
  const db = await getDb();
  const rows = await db.all<{ n: number | string }>(`SELECT COUNT(*) AS n FROM listings WHERE first_seen_at = ?`, [
    seenAt,
  ]);
  return Number(rows[0]?.n ?? 0);
}

export type IngestStats = { freshAdded: number; staleRemoved: number; ranAt: string };

/**
 * The daily cron runs in three parts (see vercel.json), so a day's totals are the sum
 * of each part's contribution rather than a single run's numbers.
 */
export async function recordIngestStats(freshAdded: number, staleRemoved: number, ranAt: string): Promise<void> {
  const db = await getDb();
  const day = ranAt.slice(0, 10);
  await db.run(
    `INSERT INTO ingest_stats (day, fresh_added, stale_removed, ran_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(day) DO UPDATE SET
       fresh_added = fresh_added + excluded.fresh_added,
       stale_removed = stale_removed + excluded.stale_removed,
       ran_at = excluded.ran_at`,
    [day, freshAdded, staleRemoved, ranAt],
  );
}

export async function getIngestStats(): Promise<IngestStats | null> {
  const db = await getDb();
  const rows = await db.all<{ fresh_added: number | string; stale_removed: number | string; ran_at: string }>(
    `SELECT fresh_added, stale_removed, ran_at FROM ingest_stats ORDER BY day DESC LIMIT 1`,
  );
  const row = rows[0];
  if (!row) return null;
  return { freshAdded: Number(row.fresh_added), staleRemoved: Number(row.stale_removed), ranAt: row.ran_at };
}

export type IngestDay = { day: string; freshAdded: number; staleRemoved: number; ranAt: string };

export type IngestHealth = {
  listings: number;
  newestFirstSeenAt: string | null;
  newestLastSeenAt: string | null;
  days: IngestDay[];
};

/**
 * Read-only summary for monitoring the nightly pull: the last two weeks of
 * ingest_stats plus when any listing was last added or refreshed. Counts only,
 * no listing content.
 */
export async function getIngestHealth(days = 14): Promise<IngestHealth> {
  const db = await getDb();
  const [totals, history] = await Promise.all([
    db.all<{ n: number | string; first_seen: string | null; last_seen: string | null }>(
      `SELECT COUNT(*) AS n, MAX(first_seen_at) AS first_seen, MAX(last_seen_at) AS last_seen FROM listings`,
    ),
    db.all<{ day: string; fresh_added: number | string; stale_removed: number | string; ran_at: string }>(
      `SELECT day, fresh_added, stale_removed, ran_at FROM ingest_stats ORDER BY day DESC LIMIT ?`,
      [days],
    ),
  ]);
  const total = totals[0];
  return {
    listings: Number(total?.n ?? 0),
    newestFirstSeenAt: total?.first_seen ?? null,
    newestLastSeenAt: total?.last_seen ?? null,
    days: history.map((row) => ({
      day: row.day,
      freshAdded: Number(row.fresh_added),
      staleRemoved: Number(row.stale_removed),
      ranAt: row.ran_at,
    })),
  };
}

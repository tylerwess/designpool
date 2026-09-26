import { getDb, type SqlParam } from "./db";
import type { Listing, ListingDraft } from "./types";
import type { Ats, BenefitId, DisciplineId, EmploymentType, IndustryId, Seniority, SizeBucket, WorkType } from "./taxonomy";

const LIST_COLUMNS = `
  id, source, external_id, company, company_token, title, url, location,
  remote_type, employment_type, salary_min, salary_max, salary_currency,
  salary_interval, posted_at, source_updated_at, first_seen_at, last_seen_at,
  seniority, stretch, years_min, years_max, industry, size_bucket, disciplines,
  benefits
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
  benefits: string;
};

function mapRow(row: ListingRow): Listing {
  let disciplines: DisciplineId[] = [];
  try {
    const parsed = JSON.parse(row.disciplines) as DisciplineId[];
    if (Array.isArray(parsed)) disciplines = parsed;
  } catch {
    disciplines = [];
  }
  let benefits: BenefitId[] = [];
  try {
    const parsed = JSON.parse(row.benefits) as BenefitId[];
    if (Array.isArray(parsed)) benefits = parsed;
  } catch {
    benefits = [];
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
    benefits,
  };
}

export async function listListings(): Promise<Listing[]> {
  const db = await getDb();
  const rows = await db.all<ListingRow>(`SELECT ${LIST_COLUMNS} FROM listings`);
  return rows.map(mapRow);
}

export async function getListing(id: string): Promise<Listing | null> {
  const db = await getDb();
  const rows = await db.all<ListingRow>(
    `SELECT ${LIST_COLUMNS}, description FROM listings WHERE id = ?`,
    [id],
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
    JSON.stringify(listing.benefits),
  ];
  await db.run(
    `INSERT INTO listings (
      id, source, external_id, company, company_token, title, url, location,
      remote_type, employment_type, salary_min, salary_max, salary_currency,
      salary_interval, description, posted_at, source_updated_at, first_seen_at,
      last_seen_at, seniority, stretch, years_min, years_max, industry,
      size_bucket, disciplines, benefits
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
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
      disciplines = excluded.disciplines,
      benefits = excluded.benefits`,
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

import type { Listing } from "./types";
import {
  isDiscipline,
  isIndustry,
  isSeniority,
  isSizeBucket,
  POSTED_WINDOWS,
  type DisciplineId,
  type EmploymentType,
  type IndustryId,
  type Seniority,
  type SizeBucket,
} from "./taxonomy";

export type SortKey = "newest" | "company";

export type JobFilters = {
  q: string;
  seniority: Seniority[];
  yearsMin: number | null;
  yearsMax: number | null;
  includeUnknownYears: boolean;
  industry: IndustryId[];
  discipline: DisciplineId[];
  work: Array<"remote" | "hybrid" | "onsite">;
  location: string;
  employment: EmploymentType[];
  salary: boolean;
  size: SizeBucket[];
  posted: string;
  sort: SortKey;
};

type SearchParams = Record<string, string | string[] | undefined>;

function values(params: SearchParams, key: string): string[] {
  const raw = params[key];
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw])
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function first(params: SearchParams, key: string): string {
  return values(params, key)[0] ?? "";
}

function numberOrNull(params: SearchParams, key: string): number | null {
  const raw = first(params, key);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function parseSearchParams(params: SearchParams): JobFilters {
  const posted = first(params, "posted");
  const unknown = params.includeUnknownYears;
  const unknownRaw = Array.isArray(unknown) ? unknown[unknown.length - 1] : unknown;
  return {
    q: first(params, "q"),
    seniority: values(params, "seniority").filter(isSeniority),
    yearsMin: numberOrNull(params, "yearsMin"),
    yearsMax: numberOrNull(params, "yearsMax"),
    includeUnknownYears: unknownRaw == null || unknownRaw === "" ? true : unknownRaw !== "0",
    industry: values(params, "industry").filter(isIndustry),
    discipline: values(params, "discipline").filter(isDiscipline),
    work: values(params, "work").filter(
      (value): value is "remote" | "hybrid" | "onsite" =>
        value === "remote" || value === "hybrid" || value === "onsite",
    ),
    location: first(params, "location"),
    employment: values(params, "employment").filter(
      (value): value is EmploymentType =>
        value === "full_time" || value === "contract" || value === "internship",
    ),
    salary: values(params, "salary").some((value) => value === "1" || value === "true"),
    size: values(params, "size").filter(isSizeBucket),
    posted: POSTED_WINDOWS.some((window) => window.id === posted) ? posted : "",
    sort: first(params, "sort") === "company" ? "company" : "newest",
  };
}

export function listingTimestamp(listing: Pick<Listing, "postedAt" | "firstSeenAt">): number {
  return Date.parse(listing.postedAt || listing.firstSeenAt);
}

const POSTED_MS: Record<string, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "14d": 14 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

function yearsOverlap(listing: Listing, filters: JobFilters): boolean {
  const active = filters.yearsMin != null || filters.yearsMax != null;
  if (!active) return true;
  const hasYears = listing.yearsMin != null || listing.yearsMax != null;
  if (!hasYears) return filters.includeUnknownYears;

  const jobMin = listing.yearsMin ?? listing.yearsMax ?? 0;
  const jobMax = listing.yearsMax ?? 99;
  const filterMin = filters.yearsMin ?? 0;
  const filterMax = filters.yearsMax ?? 99;
  return jobMin <= filterMax && jobMax >= filterMin;
}

export function matchesFilters(listing: Listing, filters: JobFilters, now = Date.now()): boolean {
  if (filters.q) {
    const haystack = `${listing.title} ${listing.company}`.toLowerCase();
    if (!haystack.includes(filters.q.toLowerCase())) return false;
  }
  if (filters.seniority.length > 0 && !filters.seniority.includes(listing.seniority)) return false;
  if (!yearsOverlap(listing, filters)) return false;
  if (filters.industry.length > 0 && !filters.industry.includes(listing.industry)) return false;
  if (
    filters.discipline.length > 0 &&
    !listing.disciplines.some((discipline) => filters.discipline.includes(discipline))
  ) {
    return false;
  }
  if (filters.work.length > 0 && !filters.work.includes(listing.remoteType as "remote" | "hybrid" | "onsite")) {
    return false;
  }
  if (filters.location) {
    const location = (listing.location ?? "").toLowerCase();
    if (!location.includes(filters.location.toLowerCase())) return false;
  }
  if (filters.employment.length > 0 && !filters.employment.includes(listing.employmentType)) return false;
  if (filters.salary && listing.salaryMin == null && listing.salaryMax == null) return false;
  if (filters.size.length > 0 && !filters.size.includes(listing.sizeBucket)) return false;
  if (filters.posted) {
    const windowMs = POSTED_MS[filters.posted];
    if (now - listingTimestamp(listing) > windowMs) return false;
  }
  return true;
}

export function applyFilters(listings: Listing[], filters: JobFilters, now = Date.now()): Listing[] {
  const matched = listings.filter((listing) => matchesFilters(listing, filters, now));
  matched.sort((a, b) => {
    if (filters.sort === "company") {
      const byCompany = a.company.localeCompare(b.company);
      return byCompany !== 0 ? byCompany : a.title.localeCompare(b.title);
    }
    return listingTimestamp(b) - listingTimestamp(a);
  });
  return matched;
}

export function emptyFilters(): JobFilters {
  return parseSearchParams({});
}

export function jobsHref(partial: Partial<JobFilters>): string {
  const query = filtersToQuery({ ...emptyFilters(), ...partial });
  return query ? `/jobs?${query}` : "/jobs";
}

export function filtersToQuery(filters: JobFilters): string {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  for (const value of filters.seniority) params.append("seniority", value);
  if (filters.yearsMin != null) params.set("yearsMin", String(filters.yearsMin));
  if (filters.yearsMax != null) params.set("yearsMax", String(filters.yearsMax));
  if (!filters.includeUnknownYears) params.set("includeUnknownYears", "0");
  for (const value of filters.industry) params.append("industry", value);
  for (const value of filters.discipline) params.append("discipline", value);
  for (const value of filters.work) params.append("work", value);
  if (filters.location) params.set("location", filters.location);
  for (const value of filters.employment) params.append("employment", value);
  if (filters.salary) params.set("salary", "1");
  for (const value of filters.size) params.append("size", value);
  if (filters.posted) params.set("posted", filters.posted);
  if (filters.sort !== "newest") params.set("sort", filters.sort);
  return params.toString();
}

export function activeFilterCount(filters: JobFilters): number {
  return [
    filters.q,
    filters.seniority.length,
    filters.yearsMin != null || filters.yearsMax != null,
    filters.industry.length,
    filters.discipline.length,
    filters.work.length,
    filters.location,
    filters.employment.length,
    filters.salary,
    filters.size.length,
    filters.posted,
    filters.sort !== "newest",
  ].filter(Boolean).length;
}

import type { Company } from "../data/companies";
import { companiesForIngest } from "./ingest-sources";
import { classifyListing } from "./llm";
import { isDesignRole } from "./design-role";
import { deleteExpired, deleteStale, countBySeniority, upsertListing } from "./listings";
import { fetchCompanyJobs, type FetchedJob } from "./sources";
import { disciplinesFor } from "./text";
import { parseYears } from "./years";
import type { ListingDraft } from "./types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const FETCH_CONCURRENCY = 6;

export type IngestResult = {
  ok: boolean;
  sources: string[];
  companies: number;
  succeeded: number;
  failed: Array<{ name: string; error: string }>;
  upserted: number;
  deletedStale: number;
  deletedExpired: number;
  bySeniority: Record<string, number>;
  total: number;
};

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}

export async function toListingDraft(company: Company, job: FetchedJob, seenAt: string): Promise<ListingDraft | null> {
  if (!isDesignRole(job.title)) return null;
  const description = job.description.slice(0, 20000);
  const years = parseYears(description);
  const classification = await classifyListing({
    title: job.title,
    description,
    sizeBucket: company.sizeBucket,
    yearsMin: years.yearsMin,
    yearsMax: years.yearsMax,
  });
  const salary =
    job.salary.min != null || job.salary.max != null
      ? job.salary
      : { min: null, max: null, currency: null, interval: null };

  return {
    id: `${company.ats}:${company.token}:${job.externalId}`,
    source: company.ats,
    externalId: job.externalId,
    company: company.name,
    companyToken: company.token,
    title: job.title,
    url: job.url,
    location: job.location,
    remoteType: job.remoteType,
    employmentType: job.employmentType,
    salaryMin: salary.min,
    salaryMax: salary.max,
    salaryCurrency: salary.currency,
    salaryInterval: salary.interval,
    description,
    postedAt: job.postedAt,
    sourceUpdatedAt: job.sourceUpdatedAt,
    firstSeenAt: seenAt,
    lastSeenAt: seenAt,
    seniority: classification.seniority,
    stretch: classification.stretch,
    yearsMin: years.yearsMin,
    yearsMax: years.yearsMax,
    industry: company.industry,
    sizeBucket: company.sizeBucket,
    disciplines: disciplinesFor(job.title, description),
  };
}

export async function runIngest(source: Company[] = companiesForIngest()): Promise<IngestResult> {
  const seenAt = new Date().toISOString();
  const cutoff = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();
  let deletedExpired = await deleteExpired(cutoff);

  const outcomes = await mapPool(source, FETCH_CONCURRENCY, async (company, index) => {
    try {
      const jobs = await fetchCompanyJobs(company);
      let upserted = 0;
      for (const job of jobs) {
        const draft = await toListingDraft(company, job, seenAt);
        if (!draft) continue;
        await upsertListing(draft);
        upserted += 1;
      }
      // Only this company's rows. A source left out of the run is never passed in,
      // and a failed fetch never reaches this delete, so those listings stay.
      const deletedStale = await deleteStale(company.ats, company.token, seenAt);
      console.error(`[ingest ${index + 1}/${source.length}] ${company.name}: ${upserted} design roles`);
      return { ok: true as const, name: company.name, upserted, deletedStale };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[ingest ${index + 1}/${source.length}] ${company.name} failed: ${message}`);
      return { ok: false as const, name: company.name, error: message, upserted: 0, deletedStale: 0 };
    }
  });

  deletedExpired += await deleteExpired(cutoff);
  const bySeniority = await countBySeniority();
  const failed = outcomes.filter((outcome) => !outcome.ok).map((outcome) => ({
    name: outcome.name,
    error: outcome.error ?? "Unknown error",
  }));

  return {
    ok: failed.length === 0,
    sources: [...new Set(source.map((company) => company.ats))],
    companies: source.length,
    succeeded: outcomes.length - failed.length,
    failed,
    upserted: outcomes.reduce((sum, outcome) => sum + outcome.upserted, 0),
    deletedStale: outcomes.reduce((sum, outcome) => sum + outcome.deletedStale, 0),
    deletedExpired,
    bySeniority,
    total: Object.values(bySeniority).reduce((sum, count) => sum + count, 0),
  };
}

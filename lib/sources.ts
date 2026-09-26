import type { Company } from "../data/companies";
import { employmentFrom, htmlToText, parseSalaryFromText, toIso, workTypeFrom, type Salary } from "./text";
import type { EmploymentType, WorkType } from "./taxonomy";

export type FetchedJob = {
  externalId: string;
  title: string;
  url: string;
  location: string | null;
  remoteType: WorkType;
  employmentType: EmploymentType;
  description: string;
  postedAt: string | null;
  sourceUpdatedAt: string | null;
  salary: Salary;
};

const USER_AGENT = "designpool/1.0";

async function fetchJson(url: string, attempt = 0): Promise<unknown> {
  const response = await fetch(url, {
    headers: { accept: "application/json", "user-agent": USER_AGENT },
    signal: AbortSignal.timeout(30000),
  });
  if ((response.status === 429 || response.status >= 500) && attempt < 2) {
    await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
    return fetchJson(url, attempt + 1);
  }
  if (!response.ok) {
    throw new Error(`${response.status} from ${url}`);
  }
  return response.json();
}

type GreenhouseJob = {
  id?: number | string;
  title?: string;
  absolute_url?: string;
  location?: { name?: string | null };
  content?: string | null;
  first_published?: string | null;
  updated_at?: string | null;
  metadata?: Array<{ name?: string; value?: string | number | null }> | null;
};

export async function fetchGreenhouse(company: Company): Promise<FetchedJob[]> {
  const payload = (await fetchJson(
    `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(company.token)}/jobs?content=true`,
  )) as { jobs?: GreenhouseJob[] };
  return (payload.jobs ?? []).flatMap((job) => {
    if (!job.id || !job.title || !job.absolute_url) return [];
    const description = htmlToText(job.content);
    const location = job.location?.name?.trim() || null;
    const metadataText = (job.metadata ?? [])
      .map((item) => `${item.name ?? ""} ${item.value ?? ""}`)
      .join(" ");
    return [
      {
        externalId: String(job.id),
        title: job.title.trim(),
        url: job.absolute_url,
        location,
        remoteType: workTypeFrom({ location }),
        employmentType: employmentFrom(metadataText, job.title),
        description,
        postedAt: toIso(job.first_published),
        sourceUpdatedAt: toIso(job.updated_at),
        salary: parseSalaryFromText(`${description}\n${metadataText}`),
      },
    ];
  });
}

type AshbyComponent = {
  compensationType?: string;
  interval?: string;
  currencyCode?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
};

type AshbyJob = {
  id?: string;
  title?: string;
  location?: string | null;
  isRemote?: boolean | null;
  isListed?: boolean | null;
  workplaceType?: string | null;
  publishedAt?: string | null;
  employmentType?: string | null;
  jobUrl?: string | null;
  descriptionPlain?: string | null;
  descriptionHtml?: string | null;
  compensation?: {
    summaryComponents?: AshbyComponent[];
    compensationTiers?: Array<{ components?: AshbyComponent[] }>;
  } | null;
};

function ashbySalary(job: AshbyJob): Salary {
  const components = [
    ...(job.compensation?.summaryComponents ?? []),
    ...(job.compensation?.compensationTiers ?? []).flatMap((tier) => tier.components ?? []),
  ];
  const salary = components.find(
    (component) =>
      component.compensationType === "Salary" && (component.minValue != null || component.maxValue != null),
  );
  if (!salary) return { min: null, max: null, currency: null, interval: null };
  const interval = (salary.interval ?? "").toLowerCase();
  return {
    min: salary.minValue ?? null,
    max: salary.maxValue ?? null,
    currency: salary.currencyCode ?? "USD",
    interval: interval.includes("hour") ? "hour" : interval.includes("year") || interval.includes("1 year") ? "year" : interval || "year",
  };
}

export async function fetchAshby(company: Company): Promise<FetchedJob[]> {
  const payload = (await fetchJson(
    `https://api.ashbyhq.com/posting-api/job-board/${encodeURIComponent(company.token)}?includeCompensation=true`,
  )) as { jobs?: AshbyJob[] };
  return (payload.jobs ?? []).flatMap((job) => {
    if (!job.id || !job.title || !job.jobUrl || job.isListed === false) return [];
    const description = (job.descriptionPlain || htmlToText(job.descriptionHtml)).trim();
    const structured = ashbySalary(job);
    const salary =
      structured.min != null || structured.max != null ? structured : parseSalaryFromText(description);
    return [
      {
        externalId: job.id,
        title: job.title.trim(),
        url: job.jobUrl,
        location: job.location?.trim() || null,
        remoteType: workTypeFrom({
          location: job.location,
          workplaceType: job.workplaceType,
          isRemote: job.isRemote,
        }),
        employmentType: employmentFrom(job.employmentType, job.title),
        description,
        postedAt: toIso(job.publishedAt),
        sourceUpdatedAt: toIso(job.publishedAt),
        salary,
      },
    ];
  });
}

type LeverJob = {
  id?: string;
  text?: string;
  hostedUrl?: string;
  createdAt?: number;
  descriptionPlain?: string;
  descriptionBodyPlain?: string;
  descriptionBody?: string;
  additionalPlain?: string;
  workplaceType?: string;
  country?: string;
  categories?: {
    location?: string;
    commitment?: string;
    allLocations?: string[];
  };
  lists?: Array<{ text?: string; content?: string }>;
};

export async function fetchLever(company: Company): Promise<FetchedJob[]> {
  const payload = (await fetchJson(
    `https://api.lever.co/v0/postings/${encodeURIComponent(company.token)}?mode=json`,
  )) as LeverJob[];
  const jobs = Array.isArray(payload) ? payload : [];
  return jobs.flatMap((job) => {
    if (!job.id || !job.text || !job.hostedUrl) return [];
    const listText = (job.lists ?? [])
      .map((list) => `${list.text ?? ""}\n${htmlToText(list.content)}`)
      .join("\n");
    const description = [job.descriptionBodyPlain || htmlToText(job.descriptionBody) || job.descriptionPlain, listText, job.additionalPlain]
      .filter(Boolean)
      .join("\n\n")
      .trim();
    const location =
      job.categories?.allLocations?.filter(Boolean).join(" · ") ||
      job.categories?.location ||
      job.country ||
      null;
    return [
      {
        externalId: job.id,
        title: job.text.trim(),
        url: job.hostedUrl,
        location,
        remoteType: workTypeFrom({ location, workplaceType: job.workplaceType }),
        employmentType: employmentFrom(job.categories?.commitment, job.text),
        description,
        postedAt: toIso(job.createdAt),
        sourceUpdatedAt: toIso(job.createdAt),
        salary: parseSalaryFromText(description),
      },
    ];
  });
}

export async function fetchCompanyJobs(company: Company): Promise<FetchedJob[]> {
  if (company.ats === "greenhouse") return fetchGreenhouse(company);
  if (company.ats === "ashby") return fetchAshby(company);
  return fetchLever(company);
}

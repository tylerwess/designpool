import { jobsHref, listingTimestamp } from "./filters";
import { yearsFilterLabel } from "./format";
import {
  EMPLOYMENT_TYPES,
  POSTED_WINDOWS,
  SENIORITY_LABELS,
  WORK_TYPES,
  disciplineLabel,
  industryLabel,
} from "./taxonomy";
import type { Listing } from "./types";

export type ListingTag = {
  key: string;
  label: string;
  href: string;
};

const POSTED_MS: Record<(typeof POSTED_WINDOWS)[number]["id"], number> = {
  "24h": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "14d": 14 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

const UNKNOWN = new Set(["", "not stated", "not listed", "unknown", "location flexible"]);

function known(value: string | null | undefined): value is string {
  return Boolean(value && !UNKNOWN.has(value.trim().toLowerCase()));
}

function locationLabels(raw: string): string[] {
  return raw
    .split(/\s*(?:\/|\||;|·)\s*/)
    .map((part) => part.trim())
    .filter(known);
}

export function postedWindowFor(
  listing: Pick<Listing, "postedAt" | "firstSeenAt">,
  now = Date.now(),
): (typeof POSTED_WINDOWS)[number] | null {
  const age = now - listingTimestamp(listing);
  if (!Number.isFinite(age)) return null;
  const elapsed = Math.max(0, age);
  for (const window of POSTED_WINDOWS) {
    if (elapsed <= POSTED_MS[window.id]) return window;
  }
  return null;
}

export function listingTags(listing: Listing, now = Date.now()): ListingTag[] {
  const tags: ListingTag[] = [];

  tags.push({
    key: `seniority:${listing.seniority}`,
    label: SENIORITY_LABELS[listing.seniority],
    href: jobsHref({ seniority: [listing.seniority] }),
  });

  const years = yearsFilterLabel(listing.yearsMin, listing.yearsMax);
  if (years) {
    tags.push({
      key: `years:${years}`,
      label: years,
      href: jobsHref({ yearsMin: listing.yearsMin, yearsMax: listing.yearsMax }),
    });
  }

  if (known(industryLabel(listing.industry))) {
    tags.push({
      key: `industry:${listing.industry}`,
      label: industryLabel(listing.industry),
      href: jobsHref({ industry: [listing.industry] }),
    });
  }

  for (const discipline of listing.disciplines) {
    const label = disciplineLabel(discipline);
    if (!known(label)) continue;
    tags.push({
      key: `discipline:${discipline}`,
      label,
      href: jobsHref({ discipline: [discipline] }),
    });
  }

  const work = WORK_TYPES.find((item) => item.id === listing.remoteType);
  if (work) {
    tags.push({
      key: `work:${work.id}`,
      label: work.label,
      href: jobsHref({ work: [work.id] }),
    });
  }

  if (known(listing.location)) {
    for (const location of locationLabels(listing.location)) {
      tags.push({
        key: `location:${location}`,
        label: location,
        href: jobsHref({ location }),
      });
    }
  }

  const employment = EMPLOYMENT_TYPES.find((item) => item.id === listing.employmentType);
  if (employment) {
    tags.push({
      key: `employment:${employment.id}`,
      label: employment.label,
      href: jobsHref({ employment: [employment.id] }),
    });
  }

  if (known(listing.sizeBucket)) {
    tags.push({
      key: `size:${listing.sizeBucket}`,
      label: listing.sizeBucket,
      href: jobsHref({ size: [listing.sizeBucket] }),
    });
  }

  if (listing.salaryMin != null || listing.salaryMax != null) {
    tags.push({
      key: "salary",
      label: "Has salary",
      href: jobsHref({ salary: true }),
    });
  }

  const posted = postedWindowFor(listing, now);
  if (posted) {
    tags.push({
      key: `posted:${posted.id}`,
      label: `Past ${posted.label}`,
      href: jobsHref({ posted: posted.id }),
    });
  }

  return tags;
}

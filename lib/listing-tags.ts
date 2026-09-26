import { jobsHref } from "./filters";
import { yearsFilterLabel } from "./format";
import { EMPLOYMENT_TYPES, SENIORITY_LABELS, WORK_TYPES, disciplineLabel, industryLabel } from "./taxonomy";
import type { Listing } from "./types";

export type ListingTag = {
  key: string;
  label: string;
  href: string;
};

const UNKNOWN = new Set(["", "not stated", "not listed", "unknown", "location flexible"]);

function known(value: string | null | undefined): value is string {
  return Boolean(value && !UNKNOWN.has(value.trim().toLowerCase()));
}

export function listingTags(listing: Listing): ListingTag[] {
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

  return tags;
}

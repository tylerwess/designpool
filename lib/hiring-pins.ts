import { companyWebsite } from "./company-logo";
import type { Listing } from "./types";

export type HiringPin = { company: string; website: string | null; roles: number };

/** Companies with open roles, most roles first, ties by name. One pin per company. */
export function hiringPins(
  jobs: Pick<Listing, "company" | "source" | "companyToken">[],
  limit = 8,
): HiringPin[] {
  const pins = new Map<string, HiringPin>();
  for (const job of jobs) {
    const pin = pins.get(job.company);
    if (pin) pin.roles += 1;
    else pins.set(job.company, { company: job.company, website: companyWebsite(job.source, job.companyToken), roles: 1 });
  }
  return [...pins.values()]
    .sort((a, b) => b.roles - a.roles || a.company.localeCompare(b.company))
    .slice(0, limit);
}

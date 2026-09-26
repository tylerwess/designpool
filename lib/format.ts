import { listingTimestamp } from "./filters";
import type { Listing } from "./types";

export function listingHref(listing: Pick<Listing, "source" | "companyToken" | "externalId">): string {
  return `/jobs/${listing.source}/${encodeURIComponent(listing.companyToken)}/${encodeURIComponent(listing.externalId)}`;
}
import { disciplineLabel, industryLabel, SENIORITY_LABELS } from "./taxonomy";

export function formatAge(iso: string | null, now = Date.now()): string {
  if (!iso) return "recently";
  const ms = now - Date.parse(iso);
  if (!Number.isFinite(ms) || ms < 60 * 60 * 1000) return "just now";
  const hours = Math.floor(ms / (60 * 60 * 1000));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function formatListingAge(listing: Pick<Listing, "postedAt" | "firstSeenAt">, now = Date.now()): string {
  return formatAge(new Date(listingTimestamp(listing)).toISOString(), now);
}

export function formatYears(min: number | null, max: number | null): string | null {
  if (min == null && max == null) return null;
  if (min != null && max != null) return min === max ? `${min} yrs` : `${min}–${max} yrs`;
  if (min != null) return `${min}+ yrs`;
  return `≤${max} yrs`;
}

function currencySymbol(code: string | null): string {
  if (!code || code === "USD") return "$";
  if (code === "EUR") return "€";
  if (code === "GBP") return "£";
  if (code === "CAD") return "CA$";
  return `${code} `;
}

function compactMoney(value: number, currency: string | null, hourly: boolean): string {
  const symbol = currencySymbol(currency);
  if (!hourly && value >= 1000) {
    const thousands = value / 1000;
    const rounded = thousands >= 100 ? Math.round(thousands) : Math.round(thousands * 10) / 10;
    const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    return `${symbol}${text}k`;
  }
  return `${symbol}${Math.round(value).toLocaleString("en-US")}`;
}

export function formatSalary(listing: Pick<Listing, "salaryMin" | "salaryMax" | "salaryCurrency" | "salaryInterval">): string | null {
  if (listing.salaryMin == null && listing.salaryMax == null) return null;
  const hourly = (listing.salaryInterval ?? "").toLowerCase().includes("hour");
  const suffix = hourly ? "/hr" : "";
  const min = listing.salaryMin;
  const max = listing.salaryMax;
  if (min != null && max != null && min !== max) {
    return `${compactMoney(min, listing.salaryCurrency, hourly)}–${compactMoney(max, listing.salaryCurrency, hourly)}${suffix}`;
  }
  const only = min ?? max;
  if (only == null) return null;
  if (min != null && max == null) return `From ${compactMoney(only, listing.salaryCurrency, hourly)}${suffix}`;
  if (min == null && max != null) return `Up to ${compactMoney(only, listing.salaryCurrency, hourly)}${suffix}`;
  return `${compactMoney(only, listing.salaryCurrency, hourly)}${suffix}`;
}

export function seniorityLabel(level: Listing["seniority"]): string {
  return SENIORITY_LABELS[level];
}

export function listingMeta(listing: Listing): string {
  const bits = [
    formatYears(listing.yearsMin, listing.yearsMax),
    industryLabel(listing.industry),
    ...listing.disciplines.map(disciplineLabel),
  ].filter(Boolean);
  return bits.join(" · ");
}

export function workLabel(listing: Listing): string {
  if (listing.remoteType === "remote") return "Remote";
  if (listing.remoteType === "hybrid") return "Hybrid";
  if (listing.remoteType === "onsite") return "Onsite";
  return "Location flexible";
}

import { companies, type Company } from "../data/companies";
import type { Ats } from "./taxonomy";

const ATS_VALUES = ["greenhouse", "ashby", "lever"] as const;

function isAts(value: string): value is Ats {
  return (ATS_VALUES as readonly string[]).includes(value);
}

/**
 * Which boards a run fetches. Unset or blank means Greenhouse only.
 * `greenhouse,ashby,lever` turns the other fetchers back on.
 */
export function parseIngestSources(raw: string | undefined): Ats[] {
  if (raw == null || raw.trim() === "") return ["greenhouse"];
  const parts = [...new Set(raw.split(",").map((part) => part.trim().toLowerCase()).filter(Boolean))];
  if (parts.length === 0) return ["greenhouse"];
  const unknown = parts.filter((part) => !isAts(part));
  if (unknown.length > 0) {
    throw new Error(
      `INGEST_SOURCES has unknown values: ${unknown.join(", ")}. Use greenhouse, ashby, and lever.`,
    );
  }
  return parts.filter(isAts);
}

export function companiesForIngest(list: Company[] = companies, raw = process.env.INGEST_SOURCES): Company[] {
  const enabled = new Set(parseIngestSources(raw));
  return list.filter((company) => enabled.has(company.ats));
}

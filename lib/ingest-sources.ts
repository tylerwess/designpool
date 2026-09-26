import { companies, type Company } from "../data/companies";
import type { Ats } from "./taxonomy";

const ATS_VALUES = ["greenhouse", "ashby", "lever"] as const;

function isAts(value: string): value is Ats {
  return (ATS_VALUES as readonly string[]).includes(value);
}

const ALL_SOURCES: Ats[] = ["greenhouse", "ashby", "lever"];

/**
 * Which boards a run fetches. Unset or blank means every seeded board.
 * Set `greenhouse` (or any subset) to narrow a run back down.
 */
export function parseIngestSources(raw: string | undefined): Ats[] {
  if (raw == null || raw.trim() === "") return ALL_SOURCES;
  const parts = [...new Set(raw.split(",").map((part) => part.trim().toLowerCase()).filter(Boolean))];
  if (parts.length === 0) return ALL_SOURCES;
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

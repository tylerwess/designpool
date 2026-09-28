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

export type IngestPart = { part: number; parts: number };

/**
 * Reads `?part=N&parts=M` from a cron URL. Both absent means the whole list in one run.
 * Returns an error string for anything else that is not a valid 1-based part of M.
 */
export function parseIngestPart(params: URLSearchParams): IngestPart | null | string {
  const rawPart = params.get("part");
  const rawParts = params.get("parts");
  if (rawPart == null && rawParts == null) return null;
  const part = Number(rawPart);
  const parts = Number(rawParts);
  if (!Number.isInteger(part) || !Number.isInteger(parts) || parts < 1 || part < 1 || part > parts) {
    return "part and parts must be whole numbers with 1 <= part <= parts, e.g. ?part=1&parts=3";
  }
  return { part, parts };
}

/**
 * One slice of the company list. Companies are dealt out in turn (1, 2, 3, 1, 2, 3, ...)
 * so large boards near the top of the list are spread across parts instead of
 * landing in the same run. Every company falls in exactly one part.
 */
export function companiesForPart(list: Company[], { part, parts }: IngestPart): Company[] {
  return list.filter((_, index) => index % parts === part - 1);
}

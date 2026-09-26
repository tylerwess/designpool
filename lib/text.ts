import type { DisciplineId } from "./taxonomy";

export function decodeHtml(value: string): string {
  let text = value;
  for (let i = 0; i < 2; i += 1) {
    const next = text
      .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
      .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'");
    if (next === text) break;
    text = next;
  }
  return text;
}

export function htmlToText(value: string | null | undefined): string {
  if (!value) return "";
  const decoded = decodeHtml(value);
  return decoded
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h\d|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

export function toIso(value: string | number | null | undefined): string | null {
  if (value == null || value === "") return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

export function disciplinesFor(title: string, description: string): DisciplineId[] {
  const t = title.toLowerCase();
  const found = new Set<DisciplineId>();

  if (/product design|product designer/.test(t)) found.add("product_design");
  if ((/\bux\b|user experience/.test(t)) && !/research|writer|content/.test(t)) found.add("ux");
  if (/\bui\b|visual design|graphic design|visual designer|graphic designer|interaction design/.test(t)) {
    found.add("ui_visual");
  }
  if (/brand/.test(t)) found.add("brand");
  if (/design system/.test(t)) found.add("design_systems");
  if (/user research|ux research|design research|\bresearcher\b/.test(t)) found.add("ux_research");
  if (/content design|ux writer|content designer|ux writing|conversation design/.test(t)) {
    found.add("content_design");
  }
  if (/motion design|motion designer|animator/.test(t)) found.add("motion");
  if (/design engineer|\bux engineer\b|\bui engineer\b/.test(t)) found.add("design_engineering");
  if (/\b(manager|director|head of|\bvp\b|vice president|chief|lead)\b/.test(t)) found.add("design_leadership");

  if (found.size === 0) {
    const blurb = description.toLowerCase().slice(0, 1200);
    if (/design system/.test(blurb)) found.add("design_systems");
    if (/user research|ux research/.test(blurb)) found.add("ux_research");
    if (/content design|ux writing/.test(blurb)) found.add("content_design");
    if (/motion design/.test(blurb)) found.add("motion");
    if (/brand identity|brand design/.test(blurb)) found.add("brand");
    if (found.size === 0) found.add(/\bproduct\b/.test(t) ? "product_design" : "ux");
  }

  return [...found];
}

export type Salary = {
  min: number | null;
  max: number | null;
  currency: string | null;
  interval: string | null;
};

const EMPTY_SALARY: Salary = { min: null, max: null, currency: null, interval: null };

function moneyToNumber(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "").toLowerCase();
  if (!cleaned) return null;
  if (cleaned.endsWith("k")) {
    const value = Number(cleaned.slice(0, -1));
    return Number.isFinite(value) ? Math.round(value * 1000) : null;
  }
  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.round(value) : null;
}

/** Pull a salary range out of prose when the ATS doesn't send structured pay. */
export function parseSalaryFromText(text: string | null | undefined): Salary {
  if (!text) return EMPTY_SALARY;
  const hourly = /per hour|an hour|\/\s?hr|hourly/i.test(text);
  const range =
    text.match(
      /(?:usd\s*)?\$\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?\s?[kK])\s*(?:-|–|—|to)\s*(?:usd\s*)?\$?\s?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?\s?[kK])/i,
    ) ||
    text.match(
      /\b(\d{2,3},\d{3})\s*(?:-|–|—|to)\s*\$?\s?(\d{2,3},\d{3})\s*(?:usd|dollars)?/i,
    );
  if (!range) return EMPTY_SALARY;
  const min = moneyToNumber(range[1]);
  const max = moneyToNumber(range[2]);
  if (min == null && max == null) return EMPTY_SALARY;
  return {
    min,
    max,
    currency: "USD",
    interval: hourly ? "hour" : "year",
  };
}

export function workTypeFrom(input: {
  location?: string | null;
  workplaceType?: string | null;
  isRemote?: boolean | null;
}): "remote" | "hybrid" | "onsite" | "unknown" {
  const workplace = (input.workplaceType ?? "").toLowerCase();
  const location = (input.location ?? "").toLowerCase();
  const blob = `${workplace} ${location}`;
  if (/\bhybrid\b/.test(blob)) return "hybrid";
  if (/\bremote\b/.test(blob) || workplace.includes("remote")) return "remote";
  if (/on-?site/.test(workplace)) return "onsite";
  if (input.isRemote) return "remote";
  if (location.trim()) return "onsite";
  return "unknown";
}

export function employmentFrom(raw: string | null | undefined, title: string): "full_time" | "contract" | "internship" {
  const blob = `${raw ?? ""} ${title}`.toLowerCase();
  if (/\bintern(?:ship)?s?\b/.test(blob)) return "internship";
  if (/contract|temporary|freelance|part[\s-]?time/.test(blob)) return "contract";
  return "full_time";
}

import { TYPICAL_MIN_YEARS, type Seniority, type SizeBucket } from "./taxonomy";

export type Classification = {
  seniority: Seniority;
  stretch: boolean;
};

export type ClassifyInput = {
  title: string;
  description?: string;
  sizeBucket: SizeBucket | string;
  yearsMin: number | null;
  yearsMax?: number | null;
};

function normalize(title: string): string {
  return ` ${title.toLowerCase().replace(/[^a-z0-9+]+/g, " ").replace(/\s+/g, " ").trim()} `;
}

/** Startup-sized companies treat "Head of Design" as an executive seat. */
export function isStartupSize(sizeBucket: string): boolean {
  return sizeBucket === "1-50" || sizeBucket === "51-200";
}

/**
 * People-management signals from the spec. Bare "we hire the best" culture
 * lines are removed so they don't turn an IC lead into a manager.
 */
export function hasPeopleManagement(description: string): boolean {
  const cleaned = description
    .replace(/[^.?!]*\bwe hire\b[^.?!]*[.?!]?/gi, " ")
    .replace(/[^.?!]*\bequal opportunity\b[^.?!]*[.?!]?/gi, " ");
  return /\b(direct reports?|hire|grow a team|manage a team of designers|manage a team|people management)\b/i.test(
    cleaned,
  );
}

export function levelFromTitle(title: string, description: string, sizeBucket: string): Seniority {
  const t = normalize(title);

  if (
    /\b(svp|evp|cdo|chief design officer|chief creative officer|senior vice president|vice president|vp)\b/.test(
      t,
    )
  ) {
    return "executive";
  }

  if (/\bdirector\b/.test(t)) return "director";

  if (/\bhead of\b/.test(t)) {
    return isStartupSize(sizeBucket) ? "executive" : "director";
  }

  if (/\bmanager\b/.test(t)) return "manager";
  if (/\b(principal|distinguished)\b/.test(t)) return "principal";
  if (/\bstaff\b/.test(t)) return "staff";

  if (/\blead\b/.test(t)) {
    return hasPeopleManagement(description) ? "manager" : "staff";
  }

  if (/\b(senior|sr)\b/.test(t)) return "senior";
  if (/\b(designer|design)\s+(iii|3)\b/.test(t) || /\b(level|lvl)\s+(iii|3)\b/.test(t) || /\biii\b/.test(t)) {
    return "senior";
  }

  if (
    /\b(new grad|early career|university|graduate|intern|internship)\b/.test(t) ||
    (/\b20\d{2}\b/.test(t) && /\bgrads?\b/.test(t))
  ) {
    return "new_grad";
  }

  if (/\b(associate|junior|jr|apprentice)\b/.test(t)) return "new_grad";
  if (/\b(designer|design)\s+(i|1)\b/.test(t) || /\b(level|lvl)\s+(i|1)\b/.test(t)) return "new_grad";

  if (/\b(designer|design)\s+(ii|2)\b/.test(t) || /\b(level|lvl)\s+(ii|2)\b/.test(t) || /\bii\b/.test(t)) {
    return "mid";
  }

  return "mid";
}

export function classifyRole(input: ClassifyInput): Classification {
  const description = input.description ?? "";
  const seniority = levelFromTitle(input.title, description, input.sizeBucket);
  const floor = input.yearsMin ?? input.yearsMax ?? null;
  const stretch = floor != null && floor < TYPICAL_MIN_YEARS[seniority];
  return { seniority, stretch };
}

/** Titles where a cheap LLM pass is allowed to disagree with the rules. */
export function isAmbiguousClassification(title: string, description: string): boolean {
  const t = normalize(title);
  if (!/\blead\b/.test(t)) return false;
  return !hasPeopleManagement(description);
}

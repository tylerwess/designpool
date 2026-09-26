export type YearsRequirement = {
  yearsMin: number | null;
  yearsMax: number | null;
};

const WORD_NUMBERS: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  twenty: 20,
  thirty: 30,
};

const NUMBER =
  "(\\d{1,2}|zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty)";

const YEARS_PATTERN = new RegExp(
  `(?:(?:at least|minimum of|minimum|min\\.?)\\s+)?${NUMBER}(?:\\s*(?:-|to)\\s*${NUMBER})?\\s*\\+?\\s*(?:years?|yrs?)(?:\\s*['’]?(?:\\s*of)?(?:\\s+(?:relevant|professional|hands-on|work|industry|design|product|ux|ui))?\\s+experience)?`,
  "gi",
);

function parseNumber(raw: string): number | null {
  const token = raw.toLowerCase();
  if (/^\d+$/.test(token)) {
    const value = Number(token);
    return value <= 40 ? value : null;
  }
  return WORD_NUMBERS[token] ?? null;
}

function isUnrelated(before: string, after: string): boolean {
  if (/\b(last|past|next|previous|recent|within)\s+$/i.test(before)) return true;
  if (/\b(?:over|during|in) the\s+$/i.test(before)) return true;
  if (
    /\b(?:years?|yrs?)\s+(?:of\s+)?(?:runway|funding|revenue|history|profit|profitability|operations?)\b/i.test(
      after,
    )
  ) {
    return true;
  }
  if (/\b(?:years?|yrs?)\s+ago\b/i.test(after)) return true;
  if (/\b(?:years?|yrs?)\s+olds?\b/i.test(after) || /\byear-olds?\b/i.test(after)) return true;
  if (/\b(?:years?|yrs?)\s+(?:we|we['’]ve|i['’]ve|they['’]ve|been)\b/i.test(after)) return true;
  if (/\bfor over\s+$/i.test(before) && !/experience/i.test(after)) return true;
  if (/\bin business\b/i.test(`${before} ${after}`)) return true;
  return false;
}

/**
 * Pull a years-of-experience requirement out of a job description.
 * Unrelated spans such as "5 years of runway" or "10 years old" are ignored.
 * When several requirements appear, the earliest one tied to "experience" wins.
 */
export function parseYears(text: string | null | undefined): YearsRequirement {
  const empty: YearsRequirement = { yearsMin: null, yearsMax: null };
  if (!text) return empty;

  const normalized = text.replace(/[–—]/g, "-").replace(/\u00a0/g, " ");
  const pattern = new RegExp(YEARS_PATTERN.source, "gi");
  const matches: Array<YearsRequirement & { index: number; experience: boolean }> = [];

  for (const match of normalized.matchAll(pattern)) {
    const index = match.index ?? 0;
    const before = normalized.slice(Math.max(0, index - 48), index);
    const after = normalized.slice(index, index + match[0].length + 48);
    if (isUnrelated(before, after)) continue;

    const min = parseNumber(match[1] ?? "");
    if (min == null) continue;
    const max = match[2] ? parseNumber(match[2]) : null;
    if (match[2] && (max == null || max < min)) continue;

    const window = `${before} ${after}`;
    matches.push({
      yearsMin: min,
      yearsMax: max,
      index,
      experience: /experience/i.test(window),
    });
  }

  if (matches.length === 0) return empty;
  const experienced = matches.filter((match) => match.experience);
  const pool = experienced.length > 0 ? experienced : matches;
  pool.sort((a, b) => a.index - b.index);
  const best = pool[0];
  return { yearsMin: best.yearsMin, yearsMax: best.yearsMax };
}

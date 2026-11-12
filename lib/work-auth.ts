import { htmlToText } from "./text";

export type WorkAuth = {
  opt: boolean;
  relocation: boolean;
  sponsorsVisa: boolean;
};

/** A sentence that says no ("we can't sponsor", "no relocation") doesn't count as an offer. */
const NEGATION =
  /\b(not|no|unable|cannot|can't|can’t|won't|won’t|aren't|aren’t|isn't|isn’t|doesn't|doesn’t|don't|don’t|without|unfortunately|ineligible)\b/i;

/** OPT is matched uppercase only, so "we may opt to" doesn't read as OPT. */
const OPT = /\bOPT\b|[Oo]ptional [Pp]ractical [Tt]raining/;
/** Help with moving, not "must be willing to relocate". */
const RELOCATION =
  /relocation (?:assistance|support|package|expenses?|stipend|bonus|benefits?|coverage|allowance)|(?:offer|provide|cover|support|help with)\w* relocation|help(?:s|ing)? (?:you )?(?:to )?relocate|relocation[^.]{0,40}\b(?:available|provided|offered|supported|covered|which we support)\b/i;
/** A "Relocation? Yes!" heading spans two sentences, so it's checked on the whole text. */
const RELOCATION_HEADING = /relocation\?\s*yes\b/i;
const SPONSOR = /\bsponsor(?:s|ship|ing)?\b/i;
const VISA = /\b(visas?|h-?1b|work permits?|immigration)\b/i;

function sentences(text: string): string[] {
  return text
    // A line that continues in lowercase is a wrapped sentence, not a new one.
    .replace(/\n+(?=[a-z])/g, " ")
    // Same after a period: "U.S. visa categories" stays one sentence.
    .split(/(?<=[.!?])\s+(?=[^a-z])|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function offers(sentence: string): boolean {
  return !NEGATION.test(sentence);
}

/** Reads a description for OPT, relocation help and visa sponsorship, counting only sentences that offer them. */
export function workAuthFrom(description: string | null | undefined): WorkAuth {
  const result: WorkAuth = { opt: false, relocation: false, sponsorsVisa: false };
  if (!description) return result;

  const text = htmlToText(description);
  if (RELOCATION_HEADING.test(text)) result.relocation = true;
  for (const sentence of sentences(text)) {
    if (!offers(sentence)) continue;
    if (OPT.test(sentence)) result.opt = true;
    if (RELOCATION.test(sentence)) result.relocation = true;
    if (SPONSOR.test(sentence) && VISA.test(sentence)) result.sponsorsVisa = true;
  }
  return result;
}

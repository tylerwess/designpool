/**
 * Rough language detection for listings, used to offer "Translate to English".
 * Non-Latin scripts are identified by Unicode block; Latin-script text is scored
 * against small stop-word lists. Returns null when the text reads as English
 * (or there is too little to tell).
 */

const SCRIPTS: Array<{ lang: string; pattern: RegExp }> = [
  { lang: "ja", pattern: /[぀-ヿ]/g }, // Hiragana/Katakana first: Japanese also uses Han.
  { lang: "ko", pattern: /[가-힯ᄀ-ᇿ]/g },
  { lang: "zh", pattern: /[一-鿿㐀-䶿]/g },
  { lang: "ru", pattern: /[Ѐ-ӿ]/g },
  { lang: "ar", pattern: /[؀-ۿ]/g },
  { lang: "he", pattern: /[֐-׿]/g },
  { lang: "th", pattern: /[฀-๿]/g },
  { lang: "el", pattern: /[Ͱ-Ͽ]/g },
  { lang: "hi", pattern: /[ऀ-ॿ]/g },
];

const STOP_WORDS: Record<string, string[]> = {
  en: ["the", "and", "you", "with", "for", "our", "your", "will", "are", "this", "that", "team", "work", "we"],
  de: ["und", "der", "die", "das", "mit", "für", "wir", "sie", "ist", "nicht", "auf", "eine", "bei", "dein"],
  fr: ["et", "les", "des", "une", "pour", "vous", "nous", "avec", "est", "dans", "sur", "votre", "équipe"],
  es: ["y", "los", "las", "para", "con", "una", "por", "que", "del", "nuestro", "equipo", "trabajo", "es"],
  pt: ["e", "os", "as", "para", "com", "uma", "por", "que", "não", "você", "nossa", "equipe", "trabalho"],
  it: ["e", "il", "gli", "per", "con", "una", "che", "della", "nostro", "lavoro", "sono", "siamo"],
  nl: ["en", "het", "een", "voor", "met", "wij", "jij", "zijn", "niet", "ons", "werk", "bij"],
  sv: ["och", "att", "det", "för", "med", "vi", "du", "som", "är", "inte", "på", "vår"],
};

export const LANGUAGE_NAMES: Record<string, string> = {
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  ru: "Russian",
  ar: "Arabic",
  he: "Hebrew",
  th: "Thai",
  el: "Greek",
  hi: "Hindi",
  de: "German",
  fr: "French",
  es: "Spanish",
  pt: "Portuguese",
  it: "Italian",
  nl: "Dutch",
  sv: "Swedish",
};

function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, " ").replace(/&[a-z#0-9]+;/gi, " ");
}

/** BCP 47 base code of the listing's language, or null if it reads as English. */
export function detectNonEnglish(...parts: Array<string | null | undefined>): string | null {
  const text = stripHtml(parts.filter(Boolean).join(" "));
  const letters = text.match(/\p{L}/gu)?.length ?? 0;
  if (letters < 2) return null;

  for (const { lang, pattern } of SCRIPTS) {
    const count = text.match(pattern)?.length ?? 0;
    if (count / letters > 0.2) return lang;
  }

  const words = text.toLowerCase().match(/\p{L}+/gu) ?? [];
  if (words.length < 12) return null;
  const scores = Object.fromEntries(
    Object.entries(STOP_WORDS).map(([lang, list]) => {
      const set = new Set(list);
      return [lang, words.filter((word) => set.has(word)).length];
    }),
  );
  const [best, bestScore] = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (best === "en" || bestScore < 4) return null;
  // Only call it non-English when it clearly beats English, so English posts with a few loanwords stay put.
  return bestScore > scores.en * 1.5 ? best : null;
}

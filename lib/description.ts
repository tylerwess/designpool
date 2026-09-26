const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "a",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "div",
  "span",
  "blockquote",
]);

export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  trade: "™",
  copy: "©",
  reg: "®",
};

/** Decodes stray HTML entities typed into plain-text postings, e.g. a literal "&mdash;". */
function decodeEntities(value: string): string {
  return value.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, code: string) => {
    if (code[0] === "#") {
      const codePoint = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    return NAMED_ENTITIES[code] ?? match;
  });
}

/** Un-doubles entities like "&amp;mdash;" back to "&mdash;" so the browser renders them, not the literal text. */
function fixDoubleEscapedEntities(value: string): string {
  return value.replace(/&amp;(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, "&$1;");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripDangerous(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function sanitizeDescriptionHtml(value: string): string {
  return stripDangerous(fixDoubleEscapedEntities(value)).replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (match, rawTag: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    if (tag === "br") return "<br>";
    if (match.startsWith("</")) return `</${tag}>`;
    if (tag === "a") {
      const href = match.match(/href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
      const url = href?.[1] ?? href?.[2] ?? href?.[3] ?? "";
      if (/^https?:\/\//i.test(url)) {
        return `<a href="${url}" rel="noopener noreferrer" target="_blank">`;
      }
      return "<a>";
    }
    return `<${tag}>`;
  });
}

function plainToHtml(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(decodeEntities(block)).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

/** Full sanitized HTML for the role description. Headings stay in the markup; CSS clamps the preview. */
export function toDescriptionHtml(raw: string | null | undefined): string {
  if (!raw?.trim()) return "";
  return looksLikeHtml(raw) ? sanitizeDescriptionHtml(raw) : plainToHtml(raw.trim());
}

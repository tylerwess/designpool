import { htmlToText } from "./text";

export function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function sanitizeDescriptionHtml(value: string): string {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

function splitPlain(text: string): { preview: string; rest: string } {
  const parts = text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return { preview: "", rest: "" };
  return { preview: parts[0], rest: parts.slice(1).join("\n\n") };
}

function splitHtml(html: string): { preview: string; rest: string } {
  const sanitized = sanitizeDescriptionHtml(html);
  const blocks = sanitized
    .split(/<\/(?:p|div|h[1-6]|li|section|article)>|<br\s*\/?>\s*<br\s*\/?>/i)
    .map((chunk) => htmlToText(chunk))
    .filter(Boolean);
  if (blocks.length >= 2) {
    return { preview: blocks[0], rest: blocks.slice(1).join("\n\n") };
  }
  return splitPlain(htmlToText(sanitized));
}

/** First paragraph vs the rest. HTML is sanitized, then read as text. */
export function splitDescription(raw: string | null | undefined): { preview: string; rest: string } {
  if (!raw?.trim()) return { preview: "", rest: "" };
  return looksLikeHtml(raw) ? splitHtml(raw) : splitPlain(raw.trim());
}

import { companies } from "../data/companies";

export function companyInitial(name: string): string {
  const letter = name.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

export function companyDomain(website: string | null | undefined): string | null {
  if (!website?.trim()) return null;
  try {
    const host = new URL(website).hostname.replace(/^www\./i, "").toLowerCase();
    return host || null;
  } catch {
    return null;
  }
}

/** Google serves a 128px PNG and 404s when it has no mark, which triggers the letter tile. */
export function companyLogoSrc(website: string | null | undefined): string | null {
  const domain = companyDomain(website);
  if (!domain) return null;
  return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`;
}

export function companyWebsite(source: string, token: string): string | null {
  return companies.find((company) => company.ats === source && company.token === token)?.website ?? null;
}

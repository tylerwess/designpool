import type { Metadata } from "next";

/** Production domain for the imported Vercel project. Override with NEXT_PUBLIC_SITE_URL. */
export const PRODUCTION_SITE_URL = "https://designpool-taupe.vercel.app";

export const SITE_NAME = "Designpool";

export const SITE_DESCRIPTION =
  "The design job board that respects your time. Filters that actually matter, and nothing older than 30 days.";

export function siteUrl(): URL {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const candidate = configured
    ? /^https?:\/\//i.test(configured)
      ? configured
      : `https://${configured}`
    : PRODUCTION_SITE_URL;
  try {
    return new URL(candidate);
  } catch {
    return new URL(PRODUCTION_SITE_URL);
  }
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, siteUrl()).href;
}

export function pageMetadata({
  path,
  title,
  description = SITE_DESCRIPTION,
}: {
  path: string;
  title?: string;
  description?: string;
}): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const socialTitle = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: "Designpool, a job board for design roles" };
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_US",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image.url],
    },
  };
}

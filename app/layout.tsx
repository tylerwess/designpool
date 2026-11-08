import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Fjalla_One, Inter, Inter_Tight } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { themeInitScript } from "@/lib/design-tokens";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

/** Body copy at 400, tags at 500, buttons at 600, plus navigation, filters, tags, and meta. */
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

/** Headings. */
const heading = Inter_Tight({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-heading",
});

const display = Fjalla_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const viewport: Viewport = {
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${heading.variable} ${display.variable} dark h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <Script id="designpool-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Fjalla_One, Work_Sans } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { themeInitScript } from "@/lib/design-tokens";
import { SITE_DESCRIPTION, SITE_NAME, siteUrl } from "@/lib/site";
import "./globals.css";

const sans = Work_Sans({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-sans",
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
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Designpool, a job board for design roles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <Script id="designpool-theme" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "designpool — Design job board",
  description:
    "designpool is a curated job board for product, brand, motion, and UX designers.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

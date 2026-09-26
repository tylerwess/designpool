import type { ReactNode } from "react";

export function Badge({ children, tone = "quiet" }: { children: ReactNode; tone?: "accent" | "quiet" }) {
  const className =
    tone === "accent"
      ? "rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent"
      : "rounded-full border border-line px-2.5 py-1 text-xs text-ink";
  return <span className={className}>{children}</span>;
}

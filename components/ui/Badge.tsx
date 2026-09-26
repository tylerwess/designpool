import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode; tone?: "accent" | "quiet" }) {
  return <span className="tag">{children}</span>;
}

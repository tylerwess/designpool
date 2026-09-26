import type { ReactNode } from "react";

export const fieldClassName =
  "mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted";

export function FieldLegend({ children }: { children: ReactNode }) {
  return <legend className="text-xs uppercase tracking-[0.14em] text-muted">{children}</legend>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-xs uppercase tracking-[0.14em] text-muted">{children}</span>;
}

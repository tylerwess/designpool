import type { ReactNode } from "react";

/** Fixed height, equal inline padding, no browser select chrome. */
export const controlClassName =
  "control box-border h-11 w-full appearance-none rounded-full border border-line bg-bg px-4 text-sm text-ink placeholder:text-muted";

export const fieldClassName = `mt-2 ${controlClassName}`;

export function FieldLegend({ children }: { children: ReactNode }) {
  return <legend className="text-xs uppercase tracking-[0.14em] text-muted">{children}</legend>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-xs uppercase tracking-[0.14em] text-muted">{children}</span>;
}

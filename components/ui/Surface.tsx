import type { ReactNode } from "react";

export function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-bg ${className}`.trim()}>{children}</div>;
}

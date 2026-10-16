import type { ReactNode } from "react";

export function Surface({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[12px] border border-line bg-bg ${className}`.trim()}>{children}</div>;
}

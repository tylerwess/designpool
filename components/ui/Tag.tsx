import Link from "next/link";
import type { ReactNode } from "react";

const className =
  "inline-flex h-9 items-center rounded-full border border-line bg-bg px-3.5 text-sm text-ink hover:border-ink";

export function Tag({ children, href }: { children: ReactNode; href?: string }) {
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <span className={className}>{children}</span>;
}

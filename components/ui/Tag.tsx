import Link from "next/link";
import type { ReactNode } from "react";

export function Tag({ children, href }: { children: ReactNode; href?: string }) {
  if (href) {
    return (
      <Link href={href} className="tag">
        {children}
      </Link>
    );
  }
  return <span className="tag">{children}</span>;
}

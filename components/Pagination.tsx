import Link from "next/link";
import type { ReactNode } from "react";
import { pageHref, type JobFilters } from "@/lib/filters";

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  const d = direction === "left" ? "M10 4 6 8l4 4" : "M6 4l4 4-4 4";
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function pageRange(current: number, total: number): Array<number | "ellipsis"> {
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
  const result: Array<number | "ellipsis"> = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

function PaginationItem({
  filters,
  page,
  current,
  disabled,
  label,
  children,
}: {
  filters: JobFilters;
  page: number;
  current?: boolean;
  disabled?: boolean;
  label?: string;
  children: ReactNode;
}) {
  const className =
    "flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors" +
    (current
      ? " border-accent bg-accent text-on-accent"
      : " border-line text-ink hover:bg-surface");

  if (disabled) {
    return (
      <span className={`${className} border-line text-muted opacity-40`} aria-hidden="true">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={pageHref(filters, page)}
      aria-label={label ?? `Page ${page}`}
      aria-current={current ? "page" : undefined}
      className={className}
    >
      {children}
    </Link>
  );
}

export function Pagination({
  filters,
  page,
  totalPages,
}: {
  filters: JobFilters;
  page: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5">
      <PaginationItem filters={filters} page={page - 1} disabled={page <= 1} label="Previous page">
        <ChevronIcon direction="left" />
      </PaginationItem>
      {pageRange(page, totalPages).map((entry, index) =>
        entry === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <PaginationItem key={entry} filters={filters} page={entry} current={entry === page}>
            {entry}
          </PaginationItem>
        ),
      )}
      <PaginationItem filters={filters} page={page + 1} disabled={page >= totalPages} label="Next page">
        <ChevronIcon direction="right" />
      </PaginationItem>
    </nav>
  );
}

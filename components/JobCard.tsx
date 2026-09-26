import Link from "next/link";
import { formatListingAge, formatSalary, listingHref, listingMeta, seniorityLabel, workLabel } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function JobCard({ listing }: { listing: Listing }) {
  const salary = formatSalary(listing);
  const place = [listing.location, workLabel(listing)].filter(Boolean).join(" · ");

  return (
    <article className="rounded-xl border border-line bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-serif text-2xl leading-snug">
            <Link href={listingHref(listing)} className="hover:text-accent">
              {listing.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-muted">
            {listing.company}
            {place ? ` · ${place}` : ""}
          </p>
        </div>
        <ul className="flex flex-wrap gap-1.5">
          <li className="rounded-full bg-accent-soft px-2.5 py-1 text-xs text-accent">{seniorityLabel(listing.seniority)}</li>
          {listing.stretch ? (
            <li className="rounded-full border border-line px-2.5 py-1 text-xs">Stretch</li>
          ) : null}
          {listing.remoteType === "remote" ? (
            <li className="rounded-full border border-line px-2.5 py-1 text-xs">Remote</li>
          ) : null}
          {salary ? <li className="rounded-full border border-line px-2.5 py-1 text-xs">Salary</li> : null}
        </ul>
      </div>
      {listingMeta(listing) ? <p className="mt-3 text-sm text-ink">{listingMeta(listing)}</p> : null}
      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <p className="text-muted">
          {formatListingAge(listing)}
          {salary ? ` · ${salary}` : ""}
          {listing.employmentType === "internship" ? " · Internship" : ""}
          {listing.employmentType === "contract" ? " · Contract" : ""}
        </p>
        <a
          href={listing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink px-3 py-1.5 text-ink hover:bg-ink hover:text-bg"
        >
          Apply
        </a>
      </div>
    </article>
  );
}

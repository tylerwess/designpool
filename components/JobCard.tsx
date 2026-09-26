import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { formatListingAge, formatSalary, listingHref, listingMeta, seniorityLabel, workLabel } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function JobCard({ listing, titleHref }: { listing: Listing; titleHref?: string }) {
  const salary = formatSalary(listing);
  const place = [listing.location, workLabel(listing)].filter(Boolean).join(" · ");
  const href = titleHref ?? listingHref(listing);

  return (
    <Surface className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <ul className="flex flex-wrap gap-1.5">
            <li>
              <Badge tone="accent">{seniorityLabel(listing.seniority)}</Badge>
            </li>
            {listing.stretch ? (
              <li>
                <Badge>Stretch</Badge>
              </li>
            ) : null}
            {listing.remoteType === "remote" ? (
              <li>
                <Badge>Remote</Badge>
              </li>
            ) : null}
            {salary ? (
              <li>
                <Badge>Salary</Badge>
              </li>
            ) : null}
          </ul>
          <h2 className="mt-3 font-display text-2xl leading-snug">
            <Link href={href} className="hover:underline">
              {listing.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-muted">
            {listing.company}
            {place ? ` · ${place}` : ""}
          </p>
          {listingMeta(listing) ? <p className="mt-2 text-sm leading-6 text-ink">{listingMeta(listing)}</p> : null}
          <p className="mt-2 text-sm text-muted">
            {formatListingAge(listing)}
            {salary ? ` · ${salary}` : ""}
            {listing.employmentType === "internship" ? " · Internship" : ""}
            {listing.employmentType === "contract" ? " · Contract" : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <Button href={href} variant="ghost">
            View ↗
          </Button>
          <Button href={listing.url} external variant="secondary">
            Apply
          </Button>
        </div>
      </div>
    </Surface>
  );
}

import Link from "next/link";
import { ListingByline } from "@/components/ListingByline";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import { formatSalary, listingHref, listingMeta, seniorityLabel, workLabel } from "@/lib/format";
import type { Listing } from "@/lib/types";

export function JobCard({ listing, titleHref }: { listing: Listing; titleHref?: string }) {
  const salary = formatSalary(listing);
  const href = titleHref ?? listingHref(listing);
  const work =
    listing.remoteType === "remote" || listing.remoteType === "hybrid" || listing.remoteType === "onsite"
      ? workLabel(listing)
      : null;

  return (
    <Surface className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <ListingByline listing={listing} />
          <h2 className="mt-3 font-display text-2xl leading-snug">
            <Link href={href} className="hover:underline">
              {listing.title}
            </Link>
          </h2>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            <li>
              <Badge tone="accent">{seniorityLabel(listing.seniority)}</Badge>
            </li>
            {listing.stretch ? (
              <li>
                <Badge>Stretch</Badge>
              </li>
            ) : null}
            {work ? (
              <li>
                <Badge>{work}</Badge>
              </li>
            ) : null}
            {salary ? (
              <li>
                <Badge>Salary</Badge>
              </li>
            ) : null}
          </ul>
          {listingMeta(listing) ? <p className="mt-2 text-sm leading-6 text-ink">{listingMeta(listing)}</p> : null}
          {salary || listing.employmentType !== "full_time" ? (
            <p className="mt-2 text-sm text-muted">
              {[
                salary,
                listing.employmentType === "internship" ? "Internship" : null,
                listing.employmentType === "contract" ? "Contract" : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Button href={href} variant="secondary">
            Read more
          </Button>
          <Button href={listing.url} external>
            Apply
            <span className="sr-only"> (opens the company posting in a new tab)</span>
          </Button>
        </div>
      </div>
    </Surface>
  );
}

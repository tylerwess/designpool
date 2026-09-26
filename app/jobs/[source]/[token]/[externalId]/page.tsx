import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { loadListing } from "@/lib/board";
import { formatListingAge, formatSalary, listingMeta, seniorityLabel, workLabel } from "@/lib/format";
import { pageMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

type JobParams = { source: string; token: string; externalId: string };

function listingId({ source, token, externalId }: JobParams): string {
  return `${source}:${token}:${externalId}`;
}

export async function generateMetadata({ params }: { params: Promise<JobParams> }): Promise<Metadata> {
  const resolved = await params;
  const result = await loadListing(listingId(resolved));
  const path = `/jobs/${resolved.source}/${encodeURIComponent(resolved.token)}/${encodeURIComponent(resolved.externalId)}`;
  if (!result.job) return pageMetadata({ path, title: "Role" });
  return pageMetadata({
    path,
    title: `${result.job.title} at ${result.job.company}`,
    description: `${result.job.title} at ${result.job.company}. Apply on the company’s original posting.`,
  });
}

export default async function JobPage({ params }: { params: Promise<JobParams> }) {
  const result = await loadListing(listingId(await params));
  if (result.status !== "ok") {
    return (
      <Container size="narrow" className="py-16">
        <Surface className="p-5 text-sm leading-6">{result.message}</Surface>
      </Container>
    );
  }
  if (!result.job) notFound();
  const listing = result.job;
  const salary = formatSalary(listing);

  return (
    <Container size="narrow" className="py-12">
      <article>
        <Button href="/jobs" variant="ghost">
          All roles
        </Button>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{listing.title}</h1>
        <p className="mt-3 text-muted">
          {listing.company}
          {listing.location ? ` · ${listing.location}` : ""} · {workLabel(listing)}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
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
        <p className="mt-4 text-sm">{listingMeta(listing)}</p>
        <p className="mt-2 text-sm text-muted">
          Posted {formatListingAge(listing)}
          {salary ? ` · ${salary}` : ""}
        </p>
        <div className="mt-6">
          <Button href={listing.url} external>
            Apply on company site
          </Button>
        </div>
        {listing.description ? (
          <div className="mt-10 whitespace-pre-wrap border-t border-line pt-8 text-sm leading-7">{listing.description}</div>
        ) : (
          <p className="mt-10 text-sm text-muted">The company didn’t include a description in the public feed.</p>
        )}
      </article>
    </Container>
  );
}

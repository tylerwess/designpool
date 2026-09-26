import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExpandableDescription } from "@/components/ExpandableDescription";
import { Button } from "@/components/ui/Button";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { Tag } from "@/components/ui/Tag";
import { loadListing } from "@/lib/board";
import { companyWebsite } from "@/lib/company-logo";
import { splitDescription } from "@/lib/description";
import { listingTags } from "@/lib/listing-tags";
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
  const tags = listingTags(listing);
  const description = splitDescription(listing.description);

  return (
    <Container size="narrow" className="py-12">
      <article>
        <Button href="/jobs" variant="ghost">
          All roles
        </Button>
        <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">{listing.title}</h1>
        {tags.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li key={tag.key}>
                <Tag href={tag.href}>{tag.label}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-4 flex items-center gap-3 text-muted">
          <CompanyLogo
            name={listing.company}
            website={companyWebsite(listing.source, listing.companyToken)}
            size="lg"
          />
          <span>
            {listing.company}
            {listing.location ? ` · ${listing.location}` : ""}
          </span>
        </p>
        <div className="mt-6">
          <Button href={listing.url} external>
            Apply
            <span className="sr-only"> (opens the company posting in a new tab)</span>
          </Button>
        </div>

        <h2 className="mt-10 font-display text-2xl">Description</h2>
        <ExpandableDescription
          preview={description.preview}
          rest={description.rest}
          empty="The company didn’t include a description in the public feed."
        />
        <div className="mt-8">
          <Button href={listing.url} external>
            Apply
            <span className="sr-only"> (opens the company posting in a new tab)</span>
          </Button>
        </div>
      </article>
    </Container>
  );
}

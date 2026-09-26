import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadListing } from "@/lib/board";
import { formatListingAge, formatSalary, listingMeta, seniorityLabel, workLabel } from "@/lib/format";

export const dynamic = "force-dynamic";

type JobParams = { source: string; token: string; externalId: string };

function listingId({ source, token, externalId }: JobParams): string {
  return `${source}:${token}:${externalId}`;
}

export async function generateMetadata({ params }: { params: Promise<JobParams> }): Promise<Metadata> {
  const result = await loadListing(listingId(await params));
  if (!result.job) return { title: "Role" };
  return { title: `${result.job.title} at ${result.job.company}` };
}

export default async function JobPage({ params }: { params: Promise<JobParams> }) {
  const result = await loadListing(listingId(await params));
  if (result.status !== "ok") {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16">
        <p className="rounded-xl border border-line bg-surface p-5 text-sm leading-6">{result.message}</p>
      </div>
    );
  }
  if (!result.job) notFound();
  const listing = result.job;
  const salary = formatSalary(listing);

  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <Link href="/jobs" className="text-sm text-accent">
        All roles
      </Link>
      <h1 className="mt-4 font-serif text-4xl leading-tight">{listing.title}</h1>
      <p className="mt-3 text-muted">
        {listing.company}
        {listing.location ? ` · ${listing.location}` : ""} · {workLabel(listing)}
      </p>
      <ul className="mt-4 flex flex-wrap gap-1.5 text-xs">
        <li className="rounded-full bg-accent-soft px-2.5 py-1 text-accent">{seniorityLabel(listing.seniority)}</li>
        {listing.stretch ? <li className="rounded-full border border-line px-2.5 py-1">Stretch</li> : null}
        {listing.remoteType === "remote" ? <li className="rounded-full border border-line px-2.5 py-1">Remote</li> : null}
        {salary ? <li className="rounded-full border border-line px-2.5 py-1">Salary</li> : null}
      </ul>
      <p className="mt-4 text-sm">{listingMeta(listing)}</p>
      <p className="mt-2 text-sm text-muted">
        Posted {formatListingAge(listing)}
        {salary ? ` · ${salary}` : ""}
      </p>
      <a
        href={listing.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-bg"
      >
        Apply on company site
      </a>
      {listing.description ? (
        <div className="mt-10 whitespace-pre-wrap border-t border-line pt-8 text-sm leading-7">{listing.description}</div>
      ) : (
        <p className="mt-10 text-sm text-muted">The company didn’t include a description in the public feed.</p>
      )}
    </article>
  );
}

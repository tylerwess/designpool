import Link from "next/link";
import { JobCard } from "@/components/JobCard";
import { loadBoard } from "@/lib/board";
import { listingTimestamp } from "@/lib/filters";

export const dynamic = "force-dynamic";

const values = [
  {
    title: "We keep jobs fresh",
    body: "Every listing is checked against the company’s public board. When a role leaves the feed, it leaves here too.",
  },
  {
    title: "Only 30 days allowed on here",
    body: "Age starts at the source posted date, or the day we first see the role. On day 31 it is deleted.",
  },
  {
    title: "Better filters to find roles",
    body: "Nine seniority levels, a years-of-experience range, and industry. Not another lumped “Mid-Senior” bucket.",
  },
];

export default async function HomePage() {
  const board = await loadBoard();
  const latest =
    board.status === "ok"
      ? [...board.jobs].sort((a, b) => listingTimestamp(b) - listingTimestamp(a)).slice(0, 4)
      : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:py-24">
      <p className="text-xs uppercase tracking-[0.16em] text-muted">A job board for design</p>
      <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] sm:text-6xl">
        Design roles, with filters that respect the craft.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
        Product design, UX, research, brand, and design engineering. Nine real seniority levels, and nothing that has been sitting here longer than 30 days.
      </p>
      <div className="mt-8">
        <Link href="/jobs" className="inline-flex rounded-full bg-ink px-5 py-2.5 text-sm text-bg">
          Browse open roles
        </Link>
      </div>

      <section className="mt-16 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
        {values.map((value) => (
          <article key={value.title}>
            <h2 className="font-serif text-2xl">{value.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted">{value.body}</p>
          </article>
        ))}
      </section>

      {board.status !== "ok" ? (
        <p className="mt-16 max-w-xl rounded-xl border border-line bg-surface p-5 text-sm leading-6">{board.message}</p>
      ) : latest.length > 0 ? (
        <section className="mt-16">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 className="font-serif text-3xl">Latest roles</h2>
            <Link href="/jobs" className="text-sm text-accent">
              See all
            </Link>
          </div>
          <div className="grid gap-4">
            {latest.map((listing) => (
              <JobCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      ) : (
        <p className="mt-16 max-w-xl text-sm leading-6 text-muted">
          No roles yet. Listings show up after the first ingest.
        </p>
      )}
    </div>
  );
}

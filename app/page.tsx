import { JobCard } from "@/components/JobCard";
import { Ticker } from "@/components/Ticker";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Surface } from "@/components/ui/Surface";
import { loadBoard } from "@/lib/board";
import { listingTimestamp } from "@/lib/filters";
import { pageMetadata } from "@/lib/site";
import { DISCIPLINES } from "@/lib/taxonomy";

export const metadata = pageMetadata({ path: "/" });

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
    <div>
      <Container className="py-16 sm:py-24">
        <Eyebrow>A job board for design</Eyebrow>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight sm:text-7xl">
          Design roles, with filters that respect the <span className="italic text-accent">craft.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
          Product design, UX, research, brand, and design engineering. Nine real seniority levels, and nothing that has
          been sitting here longer than 30 days.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href="/jobs">Browse open roles</Button>
          {board.status === "ok" ? (
            <p className="text-sm text-muted">
              {board.jobs.length} open {board.jobs.length === 1 ? "role" : "roles"}. None older than 30 days.
            </p>
          ) : null}
        </div>
      </Container>

      <Ticker items={DISCIPLINES.map((discipline) => discipline.label)} />

      <Container className="py-16">
        <section className="grid gap-10 border-t border-line pt-10 md:grid-cols-3">
          {values.map((value, index) => (
            <article key={value.title}>
              <p className="font-serif text-sm italic text-accent">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 font-serif text-2xl">{value.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">{value.body}</p>
            </article>
          ))}
        </section>

        {board.status !== "ok" ? (
          <Surface className="mt-16 p-5 text-sm leading-6">{board.message}</Surface>
        ) : latest.length > 0 ? (
          <section className="mt-16">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-3xl">Latest roles</h2>
              <Button href="/jobs" variant="ghost">
                See all
              </Button>
            </div>
            <div className="grid gap-4">
              {latest.map((listing) => (
                <JobCard key={listing.id} listing={listing} />
              ))}
            </div>
          </section>
        ) : (
          <p className="mt-16 max-w-xl text-sm leading-6 text-muted">No roles yet. Listings show up after the first ingest.</p>
        )}

        <section className="mt-16 grid gap-6 border-t border-line pt-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
          <div>
            <Eyebrow>How a level is chosen</Eyebrow>
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight sm:text-4xl">Nine levels, not one bucket.</h2>
          </div>
          <div>
            <p className="text-sm leading-6 text-muted">
              Title first, years second. Lead stays an individual contributor unless the role manages people. A title that
              asks for fewer years than usual keeps its level and wears a Stretch badge.
            </p>
            <div className="mt-4">
              <Button href="/about" variant="secondary">
                Read the rules
              </Button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

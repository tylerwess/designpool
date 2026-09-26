import Link from "next/link";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { loadBoard } from "@/lib/board";
import { listingTimestamp } from "@/lib/filters";
import { pageMetadata } from "@/lib/site";
import { SENIORITY_LABELS, SENIORITY_LEVELS, type Seniority } from "@/lib/taxonomy";

export const metadata = pageMetadata({ path: "/" });

export const dynamic = "force-dynamic";

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-4xl tracking-tight sm:text-6xl">{value}</p>
      <p className="mt-2 text-sm text-muted">{label}</p>
    </div>
  );
}

export default async function HomePage() {
  const board = await loadBoard();
  const jobs = board.status === "ok" ? board.jobs : [];
  const companyCount = new Set(jobs.map((job) => job.company)).size;
  const salaryCount = jobs.filter((job) => job.salaryMin != null || job.salaryMax != null).length;
  const counts = new Map<Seniority, number>();
  for (const job of jobs) counts.set(job.seniority, (counts.get(job.seniority) ?? 0) + 1);
  const segments = SENIORITY_LEVELS.filter((level) => (counts.get(level) ?? 0) > 0);
  const focus = segments.reduce<Seniority | null>((best, level) => {
    if (!best) return level;
    return (counts.get(level) ?? 0) > (counts.get(best) ?? 0) ? level : best;
  }, null);
  const preview = focus
    ? jobs
        .filter((job) => job.seniority === focus)
        .sort((a, b) => listingTimestamp(b) - listingTimestamp(a))
        .slice(0, 3)
    : [];

  return (
    <div>
      <Container className="py-24 text-center sm:py-36">
        <h1 className="mx-auto max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl">
          The design job board that respects your time.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
          Filters that actually matter. Nine seniority levels, years of experience, and industry. A role stays for 30
          days, then it is deleted.
        </p>
        <div className="mt-10">
          <Button href="/jobs">Browse open roles</Button>
        </div>
      </Container>

      {jobs.length > 0 ? (
        <Container className="pb-24">
          <div className="grid grid-cols-3 gap-4 text-center">
            <Stat value={String(jobs.length)} label={jobs.length === 1 ? "open role" : "open roles"} />
            <Stat value={String(companyCount)} label={companyCount === 1 ? "company" : "companies"} />
            <Stat value={String(salaryCount)} label="with salary" />
          </div>

          <div className="mt-16 flex justify-center">
            <div className="flex max-w-full flex-wrap justify-center gap-1 rounded-3xl border border-line p-1 sm:rounded-full">
              {segments.map((level) => {
                const selected = level === focus;
                return (
                  <Link
                    key={level}
                    href={`/jobs?seniority=${level}`}
                    aria-current={selected ? "true" : undefined}
                    className={`rounded-full px-4 py-2 text-sm ${selected ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
                  >
                    {SENIORITY_LABELS[level]}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left">
            {preview.map((listing) => (
              <JobCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-8 flex justify-center">
            <Button href={focus ? `/jobs?seniority=${focus}` : "/jobs"} variant="ghost">
              See these roles ↗
            </Button>
          </div>
        </Container>
      ) : (
        <Container className="pb-24">
          <Surface className="mx-auto max-w-xl p-6 text-center text-sm leading-6">
            {board.status === "ok" ? "No roles yet. Listings show up after the first ingest." : board.message}
          </Surface>
        </Container>
      )}

      <section className="bg-surface">
        <Container className="py-20 text-center sm:py-28">
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight sm:text-5xl">Nine levels, not one bucket.</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-muted">
            Title first, years second. Lead stays an individual contributor unless the role manages people.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/about" variant="ghost">
              Read how seniority is decided ↗
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

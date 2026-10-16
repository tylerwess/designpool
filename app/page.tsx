import { FreshListingsCount } from "@/components/FreshListingsCount";
import { HeroSearch } from "@/components/HeroSearch";
import { LandingLive } from "@/components/LandingLive";
import { LastUpdated } from "@/components/LastUpdated";
import { SourcePlatforms } from "@/components/SourcePlatforms";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { TowerLoader } from "@/components/ui/TowerLoader";
import { loadBoard, loadIngestStats } from "@/lib/board";
import { pageMetadata } from "@/lib/site";

function VerifiedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 text-accent">
      <path
        fill="currentColor"
        d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12z"
      />
      <path
        d="M7.75 12.25 10.5 15l5.75-5.75"
        fill="none"
        stroke="var(--bg)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const metadata = pageMetadata({ path: "/" });

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [board, ingestStats] = await Promise.all([loadBoard(), loadIngestStats()]);
  const jobs = board.status === "ok" ? board.jobs : [];

  return (
    <div>
      <Container size="narrow" className="pt-10 sm:pt-14">
        <div className="hero-lead">
          <h1 className="hero-title max-w-3xl font-display text-4xl leading-[1.05] sm:text-6xl">
            <TowerLoader />
            A design job board for no-nonsense jobseekers.
          </h1>
        </div>
        <p className="mt-4 max-w-2xl text-base text-muted">No ghost jobs, no paywalls, no endless scrolling.</p>
        <div className="mt-6">
          <HeroSearch />
        </div>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-muted">Open roles</p>
            <span className="metric-box">
              <FreshListingsCount count={jobs.length} className="text-[2.109375rem] text-ink" />
            </span>
            {ingestStats ? <LastUpdated iso={ingestStats.ranAt} /> : null}
          </div>
          <div className="h-px w-1/2 bg-line sm:h-auto sm:w-px sm:self-stretch" aria-hidden="true" />
          <div className="flex flex-col items-start gap-3">
            <p className="inline-flex items-center gap-1.5 text-sm text-muted">
              <VerifiedIcon />
              Real listings from
            </p>
            <SourcePlatforms className="text-lg" />
          </div>
        </div>
      </Container>

      <section aria-labelledby="latest-roles" className="source-stack mt-12 border-t border-line pt-10 pb-14">
        <Container size="narrow">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 id="latest-roles" className="text-2xl">
              Latest roles
            </h2>
            {jobs.length > 0 ? (
              <Button href="/jobs" variant="ghost" className="gap-1.5">
                View all {jobs.length}
                <ArrowIcon />
              </Button>
            ) : null}
          </div>
          {jobs.length > 0 ? (
            <LandingLive jobs={jobs} />
          ) : (
            <Surface className="landing-live max-w-xl p-5 text-sm leading-6">
              {board.status === "ok" ? "No roles yet. Listings show up after the first ingest." : board.message}
            </Surface>
          )}
        </Container>
      </section>

      <section className="bg-surface">
        <Container size="narrow" className="py-14 sm:py-16">
          <h2 className="max-w-3xl text-4xl leading-tight sm:text-5xl">Eight levels, not one bucket.</h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted">
            Title first, years second. Lead stays an individual contributor unless the role manages people.
          </p>
          <div className="mt-5">
            <Button href="/about" variant="ghost">
              Read how seniority is decided
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

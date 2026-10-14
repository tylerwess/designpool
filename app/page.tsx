import { FreshListingsCount } from "@/components/FreshListingsCount";
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
      <Container size="narrow" className="pt-16 sm:pt-20">
        <div className="hero-lead">
          <h1 className="hero-title max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl">
            <TowerLoader />
            A <span className="text-accent">design job board</span> for no-nonsense jobseekers.
          </h1>
        </div>
        <p className="mt-6 max-w-2xl text-base text-muted">No ghost jobs, no paywalls, no endless scrolling.</p>
        <div className="mt-6">
          <Button href="/jobs" className="gap-2">
            Browse open roles
            <ArrowIcon />
          </Button>
        </div>

        <div className="mt-16 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
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

      <div className="source-stack mt-16 pb-14">
        {jobs.length > 0 ? (
          <Container size="narrow">
            <LandingLive jobs={jobs} />
          </Container>
        ) : (
          <Container size="narrow">
            <Surface className="landing-live max-w-xl p-5 text-sm leading-6">
              {board.status === "ok" ? "No roles yet. Listings show up after the first ingest." : board.message}
            </Surface>
          </Container>
        )}
      </div>

      <section className="bg-surface">
        <Container size="narrow" className="py-14 sm:py-16">
          <h2 className="max-w-3xl font-display text-4xl leading-tight sm:text-5xl">Eight levels, not one bucket.</h2>
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

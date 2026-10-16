import { FreshListingsCount } from "@/components/FreshListingsCount";
import { HeroSearch } from "@/components/HeroSearch";
import { LandingLive } from "@/components/LandingLive";
import { LastUpdated } from "@/components/LastUpdated";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { TowerLoader } from "@/components/ui/TowerLoader";
import { loadBoard, loadIngestStats } from "@/lib/board";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [board, ingestStats] = await Promise.all([loadBoard(), loadIngestStats()]);
  const jobs = board.status === "ok" ? board.jobs : [];

  return (
    <div>
      <Container size="narrow" className="relative pt-10 sm:pt-14">
        {/* Freshness banner, top right under the nav, clear of the tower on the left. */}
        {ingestStats ? <LastUpdated iso={ingestStats.ranAt} className="absolute top-4 right-5" /> : null}
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

        <Surface className="mt-10 flex items-center justify-between gap-4 p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm text-muted">Open roles</p>
            <p className="text-xs text-muted">Posted in the last 30 days</p>
          </div>
          <span className="metric-box">
            <FreshListingsCount count={jobs.length} className="text-[2.109375rem] text-ink" />
          </span>
        </Surface>
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

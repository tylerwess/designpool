import { FreshListingsCount } from "@/components/FreshListingsCount";
import { HeroSearch } from "@/components/HeroSearch";
import { RoleTrend } from "@/components/RoleTrend";
import { LandingLive } from "@/components/LandingLive";
import { LastUpdated } from "@/components/LastUpdated";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { loadBoard, loadIngestStats, loadRoleTrend } from "@/lib/board";
import { pageMetadata } from "@/lib/site";

/** Bento grid: four rounded tiles of mixed sizes, for the hero chip's app-style tile. */
function BentoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <rect x="3" y="3" width="9.5" height="10.5" rx="2" />
      <rect x="14.5" y="3" width="6.5" height="6.5" rx="2" />
      <rect x="14.5" y="11.5" width="6.5" height="9.5" rx="2" />
      <rect x="3" y="15.5" width="9.5" height="5.5" rx="2" />
    </svg>
  );
}

export const metadata = pageMetadata({ path: "/" });

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [board, ingestStats] = await Promise.all([loadBoard(), loadIngestStats()]);
  const jobs = board.status === "ok" ? board.jobs : [];
  const trend = board.status === "ok" ? await loadRoleTrend(jobs.length) : null;

  return (
    <div>
      {/* Freshness banner: same container as the header, so its right edge lines up with the nav's. */}
      {ingestStats ? (
        // Hangs straight off the nav's bottom border. On phones it takes its own row so it can't cover the
        // tower; from sm up it floats over the hero's top padding.
        <Container className="relative flex justify-end sm:block">
          <LastUpdated iso={ingestStats.ranAt} className="sm:absolute sm:top-0 sm:right-5 sm:z-10" />
        </Container>
      ) : null}
      <Container size="narrow" className="pt-10 sm:pt-14">
        <h1 className="hero-title max-w-3xl text-[1.6875rem] leading-[1.1] sm:text-[2.8125rem]">
          A{" "}
          <span className="hero-chip">
            <span className="hero-chip-icon" aria-hidden="true">
              <BentoIcon />
            </span>
            design job board
          </span>{" "}
          for no-nonsense jobseekers.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted">No roles older than 30 days. Apply goes right to the official job listing.</p>
        <div className="mt-6">
          <HeroSearch />
        </div>

        <Surface className="mt-10 flex items-end justify-between gap-4 p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-2">
            <p className="text-sm text-muted">Open roles</p>
            <span className="metric-box self-start">
              <FreshListingsCount count={jobs.length} className="text-[2.109375rem] text-ink" />
            </span>
            <p className="text-xs text-muted">Posted in the last 30 days</p>
          </div>
          {trend ? <RoleTrend days={trend} /> : null}
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

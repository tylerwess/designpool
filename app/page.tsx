import { FreshListingsCount } from "@/components/FreshListingsCount";
import { HeroLevels } from "@/components/HeroLevels";
import { RoleTrend } from "@/components/RoleTrend";
import { LandingLive } from "@/components/LandingLive";
import { LastUpdated } from "@/components/LastUpdated";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { loadBoard, loadIngestStats, loadRoleTrend } from "@/lib/board";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [board, ingestStats] = await Promise.all([loadBoard(), loadIngestStats()]);
  const jobs = board.status === "ok" ? board.jobs : [];
  const trend = board.status === "ok" ? await loadRoleTrend(jobs) : null;

  return (
    <div>
      <div className="relative isolate pb-12">
        <div className="hero-bg" aria-hidden="true" />
        {/* Freshness banner: same container as the header, so its right edge lines up with the nav's. */}
        {ingestStats ? (
          // Hangs straight off the nav's bottom border. On phones it takes its own row so it can't cover the
          // tower; from sm up it floats over the hero's top padding.
          <Container className="relative flex justify-end sm:block">
            <LastUpdated iso={ingestStats.ranAt} className="sm:absolute sm:top-0 sm:right-5 sm:z-10" />
          </Container>
        ) : null}
        <Container size="narrow" className="pt-10 sm:pt-14">
          <h1 className="hero-title max-w-3xl text-[1.58203125rem] leading-[1.1] sm:text-[2.63671875rem]">
            {/* The level gets its own line so the reel never reflows the sentence; balance keeps phones from orphaning "board for". */}
            <span className="block text-balance">A no-nonsense design job board for</span>
            <span className="block">
              <HeroLevels /> designers.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted">No roles older than 30 days. Apply goes right to the official job listing.</p>
          <div className="mt-6">
            <Button href="/jobs" className="w-full gap-1.5 sm:w-auto">
              See roles
              <ArrowIcon />
            </Button>
          </div>

          <Surface className="mt-10 flex items-end justify-between gap-4 p-4 sm:p-5">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-sm text-muted">Open roles</p>
              <FreshListingsCount count={jobs.length} className="self-start text-[2.109375rem] leading-none text-ink" />
              <p className="text-xs text-muted">Posted in the last 30 days</p>
            </div>
            {trend ? <RoleTrend days={trend} /> : null}
          </Surface>
        </Container>
      </div>

      <section aria-labelledby="latest-roles" className="source-stack divider-top pt-10 pb-14">
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

      <section className="divider-top">
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

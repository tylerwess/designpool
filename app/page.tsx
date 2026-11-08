import { DisciplineChips } from "@/components/DisciplineChips";
import { FreshListingsCount } from "@/components/FreshListingsCount";
import { HeroFrame } from "@/components/HeroFrame";
import { HeroLevels } from "@/components/HeroLevels";
import { RoleTrend } from "@/components/RoleTrend";
import { LandingLive } from "@/components/LandingLive";
import { LastUpdated } from "@/components/LastUpdated";
import { LevelRamp } from "@/components/LevelRamp";
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
        <Container size="narrow" className="pt-10 sm:pt-14">
          <HeroFrame>
            <h1 className="hero-title max-w-3xl text-[1.58203125rem] leading-[1.1] sm:text-[2.63671875rem]">
              {/* The level gets its own line so the reel never reflows the sentence; balance keeps phones from orphaning "board for". */}
              <span className="block text-balance">A no-nonsense job board for</span>
              <span className="block">
                <HeroLevels />{" "}
                {/* Its own line on phones, so the streaming level never pushes "design" back and forth. */}
                <span className="block whitespace-nowrap sm:inline">
                  <span className="text-accent">design</span> professionals.
                </span>
              </span>
            </h1>
          </HeroFrame>
          <p className="mt-4 max-w-2xl text-base text-muted">No roles older than 30 days. Apply goes right to the official job listing.</p>
          <div className="mt-6">
            <Button href="/jobs" className="w-full gap-1.5 sm:w-auto">
              See roles
              <ArrowIcon />
            </Button>
          </div>

          <div className="mt-10">
            <h2 className="section-label">Browse by discipline</h2>
            <div className="mt-3">
              <DisciplineChips jobs={jobs} />
            </div>
          </div>

          <Surface className="mt-8 flex items-end justify-between gap-4 p-4 sm:p-5">
            <div className="flex min-w-0 flex-col gap-2">
              <p className="text-sm text-muted">Open roles</p>
              <FreshListingsCount count={jobs.length} className="self-start text-[2.109375rem] leading-none text-accent" />
              <p className="text-xs text-muted">Posted in the last 30 days</p>
            </div>
            {trend ? <RoleTrend days={trend} /> : null}
          </Surface>
        </Container>
      </div>

      <section aria-labelledby="latest-roles" className="source-stack divider-top pt-10 pb-14">
        <Container size="narrow">
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <h2 id="latest-roles" className="swatch-heading text-2xl">
              Latest roles
            </h2>
            {jobs.length > 0 ? (
              <Button href="/jobs" variant="ghost" className="gap-1.5">
                View all {jobs.length}
                <ArrowIcon />
              </Button>
            ) : null}
          </div>
          {ingestStats ? <LastUpdated iso={ingestStats.ranAt} className="mb-5" /> : null}
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
          <h2 className="swatch-heading max-w-3xl text-2xl">Eight levels, not one bucket.</h2>
          <p className="mt-3 max-w-xl text-base leading-7 text-muted">
            Title first, years second. Lead stays an individual contributor unless the role manages people.
          </p>
          <div className="mt-6">
            <LevelRamp />
          </div>
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

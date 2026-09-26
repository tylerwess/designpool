import { LandingLive } from "@/components/LandingLive";
import { SourcePlatforms } from "@/components/SourcePlatforms";
import { ArrowIcon, Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { TowerLoader } from "@/components/ui/TowerLoader";
import { loadBoard } from "@/lib/board";
import { FILTERS_MATTER_COPY, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const board = await loadBoard();
  const jobs = board.status === "ok" ? board.jobs : [];

  return (
    <div>
      <Container className="pt-16 sm:pt-20">
        <div className="hero-lead">
          <h1 className="hero-title max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl">
            <TowerLoader />
            The <span className="text-accent">free</span> design job board that respects your time.
          </h1>
        </div>
        <p className="mt-4 max-w-2xl text-base text-muted">
          {FILTERS_MATTER_COPY} A role stays for 30 days, then it is deleted.
        </p>
        <div className="mt-6">
          <Button href="/jobs" className="gap-2">
            Browse open roles
            <ArrowIcon />
          </Button>
        </div>

        <div className="mt-10">
          <p className="text-sm text-muted">Listings powered by</p>
          <SourcePlatforms className="mt-3 text-lg" />
        </div>
      </Container>

      <div className="source-stack mt-10 pb-14">
        {jobs.length > 0 ? (
          <Container>
            <LandingLive jobs={jobs} />
          </Container>
        ) : (
          <Container>
            <Surface className="landing-live max-w-xl p-5 text-sm leading-6">
              {board.status === "ok" ? "No roles yet. Listings show up after the first ingest." : board.message}
            </Surface>
          </Container>
        )}
      </div>

      <section className="bg-surface">
        <Container className="py-14 sm:py-16">
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

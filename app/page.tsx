import { LandingLive } from "@/components/LandingLive";
import { SourceLogoReel } from "@/components/SourceLogoReel";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { TowerLoader } from "@/components/ui/TowerLoader";
import { loadBoard } from "@/lib/board";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({ path: "/" });

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const board = await loadBoard();
  const jobs = board.status === "ok" ? board.jobs : [];

  return (
    <div>
      <Container className="py-16 text-center sm:py-20">
        <TowerLoader />
        <h1 className="mx-auto max-w-4xl font-display text-5xl leading-[1.02] sm:text-7xl">
          The <span className="text-accent">free</span> design job board that respects your time.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted">
          Filters that actually matter. Nine seniority levels, years of experience, and industry. A role stays for 30
          days, then it is deleted.
        </p>
        <div className="mt-6">
          <Button href="/jobs">Browse open roles</Button>
        </div>
      </Container>

      <div className="pb-14">
        <SourceLogoReel jobs={jobs} />
        {jobs.length > 0 ? (
          <Container className="mt-10">
            <LandingLive jobs={jobs} />
          </Container>
        ) : (
          <Container className="mt-10">
            <Surface className="mx-auto max-w-xl p-5 text-center text-sm leading-6">
              {board.status === "ok" ? "No roles yet. Listings show up after the first ingest." : board.message}
            </Surface>
          </Container>
        )}
      </div>

      <section className="bg-surface">
        <Container className="py-14 text-center sm:py-16">
          <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight sm:text-5xl">Nine levels, not one bucket.</h2>
          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted">
            Title first, years second. Lead stays an individual contributor unless the role manages people.
          </p>
          <div className="mt-5 flex justify-center">
            <Button href="/about" variant="ghost">
              Read how seniority is decided
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}

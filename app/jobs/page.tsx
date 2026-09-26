import type { Metadata } from "next";
import { Filters } from "@/components/Filters";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { loadBoard } from "@/lib/board";
import { applyFilters, parseSearchParams } from "@/lib/filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jobs",
  description: "Open design roles, filtered by seniority, years, industry, and more.",
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseSearchParams(await searchParams);
  const board = await loadBoard();
  const jobs = board.status === "ok" ? applyFilters(board.jobs, filters) : [];

  return (
    <Container className="py-10">
      <h1 className="font-serif text-4xl sm:text-5xl">Open roles</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Design roles from public company boards. Each one is at most 30 days old.
      </p>
      <div className="mt-8 lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-10">
        <Filters filters={filters} />
        <section>
          {board.status !== "ok" ? (
            <Surface className="p-5 text-sm leading-6">{board.message}</Surface>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted">
                {jobs.length} {jobs.length === 1 ? "role" : "roles"}
              </p>
              {jobs.length === 0 ? (
                <Surface className="p-5 text-sm leading-6">
                  No roles match these filters.{" "}
                  <Button href="/jobs" variant="ghost">
                    Clear filters
                  </Button>
                </Surface>
              ) : (
                <div className="grid gap-4">
                  {jobs.map((listing) => (
                    <JobCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </Container>
  );
}

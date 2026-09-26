import { Filters } from "@/components/Filters";
import { JobCard } from "@/components/JobCard";
import { Pagination } from "@/components/Pagination";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Surface } from "@/components/ui/Surface";
import { loadBoard } from "@/lib/board";
import { JOBS_PAGE_SIZE, applyFilters, clampPage, parseSearchParams } from "@/lib/filters";
import { pageMetadata } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = pageMetadata({
  path: "/jobs",
  title: "Jobs",
  description: "Open design roles, filtered by seniority, years, industry, and more.",
});

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawParams = await searchParams;
  const filters = parseSearchParams(rawParams);
  const board = await loadBoard();
  const jobs = board.status === "ok" ? applyFilters(board.jobs, filters) : [];
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PAGE_SIZE));
  const rawPage = Array.isArray(rawParams.page) ? rawParams.page[0] : rawParams.page;
  const page = clampPage(Number(rawPage ?? 1), totalPages);
  const pageJobs = jobs.slice((page - 1) * JOBS_PAGE_SIZE, page * JOBS_PAGE_SIZE);

  return (
    <Container className="py-10">
      <h1 className="font-display text-4xl sm:text-5xl">Open roles</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Design roles from public company boards. Each one is at most 30 days old.
      </p>
      <div className="mt-8">
        <Filters filters={filters} />
        <section className="mt-8">
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
                <>
                  <div className="grid gap-4">
                    {pageJobs.map((listing) => (
                      <JobCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                  <Pagination filters={filters} page={page} totalPages={totalPages} />
                </>
              )}
            </>
          )}
        </section>
      </div>
    </Container>
  );
}

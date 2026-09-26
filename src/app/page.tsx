import { JobBoard } from "@/components/JobBoard";
import { jobs } from "@/lib/jobs";

export default function Home() {
  const remoteCount = jobs.filter((j) => j.remote).length;

  return (
    <main className="flex-1">
      <header className="border-b border-border bg-surface">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
              d
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              designpool
            </span>
          </div>
          <div className="hidden items-center gap-6 text-sm text-muted sm:flex">
            <a className="transition-colors hover:text-foreground" href="#">
              Browse
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Companies
            </a>
            <a className="transition-colors hover:text-foreground" href="#">
              Salaries
            </a>
          </div>
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover">
            Post a job
          </button>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-10 pt-14 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {jobs.length} curated design roles
        </span>
        <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Find your next role in the{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            design pool
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-muted sm:text-lg">
          A curated job board for product, brand, motion, and UX designers.
          {" "}
          {remoteCount} of {jobs.length} roles are remote-friendly.
        </p>
      </section>

      <JobBoard />

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted">
          © {new Date().getFullYear()} designpool · Built for designers, by
          designers.
        </div>
      </footer>
    </main>
  );
}

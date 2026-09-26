import type { Job } from "@/lib/jobs";

function postedLabel(days: number): string {
  if (days <= 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  return weeks <= 1 ? "1w ago" : `${weeks}w ago`;
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article
      className={`group relative flex flex-col gap-4 rounded-2xl border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 ${
        job.featured ? "border-primary/40" : "border-border"
      }`}
    >
      {job.featured && (
        <span className="absolute right-5 top-5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          Featured
        </span>
      )}

      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
          {job.companyInitials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">
            {job.title}
          </h3>
          <p className="text-sm text-muted">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-muted ring-1 ring-inset ring-border"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-1">
          <span aria-hidden>📍</span>
          {job.location}
        </span>
        {job.remote && (
          <span className="font-medium text-primary">Remote-friendly</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{job.salary}</p>
          <p className="text-xs text-muted">
            {job.type} · {postedLabel(job.postedDaysAgo)}
          </p>
        </div>
        <button className="rounded-lg bg-foreground px-3.5 py-2 text-sm font-medium text-white transition-colors group-hover:bg-primary">
          View role
        </button>
      </div>
    </article>
  );
}

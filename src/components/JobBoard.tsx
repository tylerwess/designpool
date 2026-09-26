"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  JOB_TYPES,
  jobs,
  type JobCategory,
  type JobType,
} from "@/lib/jobs";
import { JobCard } from "./JobCard";

export function JobBoard() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<JobCategory | "All">("All");
  const [type, setType] = useState<JobType | "All">("All");
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      if (category !== "All" && job.category !== category) return false;
      if (type !== "All" && job.type !== type) return false;
      if (remoteOnly && !job.remote) return false;
      if (!q) return true;
      const haystack = [
        job.title,
        job.company,
        job.location,
        job.category,
        ...job.tags,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category, type, remoteOnly]);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pb-24">
      <div className="sticky top-0 z-10 -mx-6 mb-8 bg-background/80 px-6 py-4 backdrop-blur">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden
              >
                🔎
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roles, companies, skills…"
                aria-label="Search jobs"
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as JobType | "All")}
              aria-label="Filter by job type"
              className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All types</option>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <label className="inline-flex cursor-pointer select-none items-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={remoteOnly}
                onChange={(e) => setRemoteOnly(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Remote only
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={category === "All"}
              onClick={() => setCategory("All")}
            >
              All roles
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {filtered.length} open {filtered.length === 1 ? "role" : "roles"}
        </h2>
        <p className="text-sm text-muted">Updated daily</p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <p className="text-base font-medium text-foreground">
            No roles match your filters
          </p>
          <p className="mt-1 text-sm text-muted">
            Try clearing the search or picking a different category.
          </p>
        </div>
      )}
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "bg-primary text-white"
          : "bg-background text-muted ring-1 ring-inset ring-border hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

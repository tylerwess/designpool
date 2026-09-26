"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Odometer } from "@/components/Odometer";
import { Button } from "@/components/ui/Button";
import { listingTimestamp } from "@/lib/filters";
import { SENIORITY_LABELS, SENIORITY_LEVELS, type Seniority } from "@/lib/taxonomy";
import type { Listing } from "@/lib/types";

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="font-display text-4xl leading-none sm:text-6xl">
        <Odometer value={value} />
      </p>
      <p className="mt-1.5 text-sm text-muted">{label}</p>
    </div>
  );
}

export function LandingLive({ jobs }: { jobs: Listing[] }) {
  const companyCount = useMemo(() => new Set(jobs.map((job) => job.company)).size, [jobs]);
  const { segments, initial } = useMemo(() => {
    const counts = new Map<Seniority, number>();
    for (const job of jobs) counts.set(job.seniority, (counts.get(job.seniority) ?? 0) + 1);
    const levels = SENIORITY_LEVELS.filter((level) => (counts.get(level) ?? 0) > 0);
    const start = levels.reduce<Seniority | null>((best, level) => {
      if (!best) return level;
      return (counts.get(level) ?? 0) > (counts.get(best) ?? 0) ? level : best;
    }, null);
    return { segments: levels, initial: start };
  }, [jobs]);
  const [focus, setFocus] = useState<Seniority | null>(initial);
  const preview = useMemo(() => {
    if (!focus) return [];
    return jobs
      .filter((job) => job.seniority === focus)
      .sort((a, b) => listingTimestamp(b) - listingTimestamp(a))
      .slice(0, 3);
  }, [focus, jobs]);

  return (
    <div>
      <div className="mx-auto grid max-w-md grid-cols-2 gap-8 text-center sm:gap-16">
        <Stat value={jobs.length} label={jobs.length === 1 ? "open role" : "open roles"} />
        <Stat value={companyCount} label={companyCount === 1 ? "company" : "companies"} />
      </div>

      {segments.length > 0 ? (
        <div className="mt-8 flex justify-center">
          <div
            role="tablist"
            aria-label="Experience level"
            className="flex max-w-full flex-wrap justify-center gap-1 rounded-3xl border border-line p-1 sm:rounded-full"
          >
            {segments.map((level) => {
              const selected = level === focus;
              return (
                <button
                  key={level}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`landing-seniority-${level}`}
                  aria-controls="landing-preview"
                  className={`rounded-full px-4 py-2 text-sm ${selected ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
                  onClick={() => setFocus(level)}
                >
                  {SENIORITY_LABELS[level]}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        id="landing-preview"
        role="tabpanel"
        aria-labelledby={focus ? `landing-seniority-${focus}` : undefined}
        className="mx-auto mt-6 grid max-w-3xl gap-3 text-left"
      >
        {preview.map((listing) => (
          <JobCard key={listing.id} listing={listing} />
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Button href={focus ? `/jobs?seniority=${focus}` : "/jobs"}>Explore more in search</Button>
      </div>
    </div>
  );
}

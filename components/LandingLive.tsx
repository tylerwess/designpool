"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/Button";
import { listingTimestamp } from "@/lib/filters";
import { SENIORITY_LABELS, SENIORITY_LEVELS, type Seniority } from "@/lib/taxonomy";
import type { Listing } from "@/lib/types";

export function LandingLive({ jobs }: { jobs: Listing[] }) {
  const { segments, initial } = useMemo(() => {
    const counts = new Map<Seniority, number>();
    for (const job of jobs) counts.set(job.seniority, (counts.get(job.seniority) ?? 0) + 1);
    const levels = SENIORITY_LEVELS.filter((level) => (counts.get(level) ?? 0) > 0);
    const mostPopulous = levels.reduce<Seniority | null>((best, level) => {
      if (!best) return level;
      return (counts.get(level) ?? 0) > (counts.get(best) ?? 0) ? level : best;
    }, null);
    const start = levels.includes("new_grad") ? "new_grad" : mostPopulous;
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
    <div className="landing-live">
      {segments.length > 0 ? (
        <div className="landing-seniority-wrap">
          <div role="tablist" aria-label="Experience level" className="landing-seniority">
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
                  className={`landing-seniority-tab ${selected ? "is-active" : ""}`}
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
        className="landing-preview grid max-w-3xl gap-3"
      >
        {preview.map((listing) => (
          <JobCard key={listing.id} listing={listing} />
        ))}
      </div>
      <div className="landing-preview-cta">
        <Button href={focus ? `/jobs?seniority=${focus}` : "/jobs"}>Explore more in search</Button>
      </div>
    </div>
  );
}

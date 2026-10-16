"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/Button";
import { listingTimestamp } from "@/lib/filters";
import { SENIORITY_LABELS, SENIORITY_LEVELS, type Seniority } from "@/lib/taxonomy";
import type { Listing } from "@/lib/types";

/** Enough rows to read as a board, not a teaser. */
const PREVIEW_COUNT = 8;

export function LandingLive({ jobs }: { jobs: Listing[] }) {
  const segments = useMemo(() => {
    const present = new Set(jobs.map((job) => job.seniority));
    return SENIORITY_LEVELS.filter((level) => present.has(level));
  }, [jobs]);
  /** "all" shows the newest roles across every level, so the board never opens on a near-empty tab. */
  const [focus, setFocus] = useState<Seniority | "all">("all");
  const matching = useMemo(
    () => (focus === "all" ? jobs : jobs.filter((job) => job.seniority === focus)),
    [focus, jobs],
  );
  const preview = useMemo(
    () => [...matching].sort((a, b) => listingTimestamp(b) - listingTimestamp(a)).slice(0, PREVIEW_COUNT),
    [matching],
  );
  const tabs: Array<{ id: Seniority | "all"; label: string }> = [
    { id: "all", label: "All levels" },
    ...segments.map((level) => ({ id: level, label: SENIORITY_LABELS[level] })),
  ];

  return (
    <div className="landing-live">
      {tabs.length > 1 ? (
        <div className="landing-seniority-wrap">
          <div role="tablist" aria-label="Experience level" className="landing-seniority">
            {tabs.map((tab) => {
              const selected = tab.id === focus;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  id={`landing-seniority-${tab.id}`}
                  aria-controls="landing-preview"
                  className={`landing-seniority-tab ${selected ? "is-active" : ""}`}
                  onClick={() => setFocus(tab.id)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div
        id="landing-preview"
        role="tabpanel"
        aria-labelledby={`landing-seniority-${focus}`}
        className="landing-preview grid max-w-3xl gap-3"
      >
        {preview.map((listing) => (
          <JobCard key={listing.id} listing={listing} />
        ))}
      </div>
      <div className="landing-preview-cta">
        <Button href={focus === "all" ? "/jobs" : `/jobs?seniority=${focus}`} variant="secondary">
          {focus === "all"
            ? `See all ${matching.length} roles`
            : `See all ${matching.length} ${SENIORITY_LABELS[focus]} roles`}
        </Button>
      </div>
    </div>
  );
}

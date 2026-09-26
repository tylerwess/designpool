"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { activeFilterCount, type JobFilters } from "@/lib/filters";
import {
  DISCIPLINES,
  EMPLOYMENT_TYPES,
  INDUSTRIES,
  POSTED_WINDOWS,
  SENIORITY_LABELS,
  SENIORITY_LEVELS,
  SIZE_BUCKETS,
  WORK_TYPES,
} from "@/lib/taxonomy";

function CheckGroup({
  legend,
  name,
  options,
  selected,
}: {
  legend: string;
  name: string;
  options: Array<{ id: string; label: string }>;
  selected: string[];
}) {
  return (
    <fieldset>
      <legend className="text-xs uppercase tracking-[0.14em] text-muted">{legend}</legend>
      <div className="mt-2 space-y-1.5">
        {options.map((option) => (
          <label key={option.id} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              value={option.id}
              defaultChecked={selected.includes(option.id)}
              className="accent-accent"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Filters({ filters }: { filters: JobFilters }) {
  const [open, setOpen] = useState(false);
  const formId = useId();
  const count = activeFilterCount(filters);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          className="rounded-full border border-line bg-surface px-4 py-2 text-sm"
          aria-expanded={open}
          aria-controls={formId}
          onClick={() => setOpen(true)}
        >
          Filters{count ? ` (${count})` : ""}
        </button>
        <Link href="/jobs" className="text-sm text-accent">
          Clear filters
        </Link>
      </div>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-20 bg-ink/30 lg:hidden"
          aria-label="Close filters"
          onClick={() => setOpen(false)}
        />
      ) : null}
      <aside
        id={formId}
        className={`${open ? "fixed inset-y-0 right-0 z-30 block w-[min(100%,22rem)] overflow-auto bg-bg p-5 shadow-none" : "hidden"} lg:sticky lg:top-4 lg:block lg:max-h-[calc(100vh-2rem)] lg:w-auto lg:overflow-auto lg:bg-transparent lg:p-0`}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="font-serif text-2xl">Filters</h2>
          <button type="button" className="text-sm text-accent" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <form
          action="/jobs"
          method="get"
          className="space-y-6"
          onChange={(event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement && ["search", "text", "number"].includes(target.type)) return;
            event.currentTarget.requestSubmit();
          }}
        >
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.14em] text-muted">Search</span>
            <input
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder="Title or company"
              className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.14em] text-muted">Sort</span>
            <select
              name="sort"
              defaultValue={filters.sort}
              className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="company">Company A–Z</option>
            </select>
          </label>

          <CheckGroup
            legend="Seniority"
            name="seniority"
            selected={filters.seniority}
            options={SENIORITY_LEVELS.map((level) => ({ id: level, label: SENIORITY_LABELS[level] }))}
          />

          <fieldset>
            <legend className="text-xs uppercase tracking-[0.14em] text-muted">Years asked</legend>
            <p className="mt-2 text-xs leading-5 text-muted">
              Senior roles asking for 5 years or fewer: set the maximum to 5.
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="text-sm">
                Min
                <input
                  type="number"
                  name="yearsMin"
                  min={0}
                  max={40}
                  defaultValue={filters.yearsMin ?? ""}
                  className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2"
                />
              </label>
              <label className="text-sm">
                Max
                <input
                  type="number"
                  name="yearsMax"
                  min={0}
                  max={40}
                  defaultValue={filters.yearsMax ?? ""}
                  className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2"
                />
              </label>
            </div>
            <label className="mt-3 block text-sm">
              Roles with no years stated
              <select
                name="includeUnknownYears"
                defaultValue={filters.includeUnknownYears ? "1" : "0"}
                className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2"
              >
                <option value="1">Include them</option>
                <option value="0">Hide them</option>
              </select>
            </label>
          </fieldset>

          <CheckGroup legend="Industry" name="industry" selected={filters.industry} options={[...INDUSTRIES]} />
          <CheckGroup legend="Discipline" name="discipline" selected={filters.discipline} options={[...DISCIPLINES]} />
          <CheckGroup legend="Work type" name="work" selected={filters.work} options={[...WORK_TYPES]} />

          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.14em] text-muted">Location</span>
            <input
              type="search"
              name="location"
              defaultValue={filters.location}
              placeholder="City or country"
              className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2"
            />
          </label>

          <CheckGroup
            legend="Employment"
            name="employment"
            selected={filters.employment}
            options={[...EMPLOYMENT_TYPES]}
          />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="salary" value="1" defaultChecked={filters.salary} className="accent-accent" />
            Has salary
          </label>

          <CheckGroup
            legend="Company size"
            name="size"
            selected={filters.size}
            options={SIZE_BUCKETS.map((bucket) => ({ id: bucket, label: bucket }))}
          />

          <label className="block text-sm">
            <span className="text-xs uppercase tracking-[0.14em] text-muted">Posted within</span>
            <select
              name="posted"
              defaultValue={filters.posted}
              className="mt-2 w-full rounded-lg border border-line bg-surface px-3 py-2"
            >
              <option value="">Any time</option>
              {POSTED_WINDOWS.map((window) => (
                <option key={window.id} value={window.id}>
                  {window.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-4">
            <button type="submit" className="rounded-full bg-ink px-4 py-2 text-sm text-bg">
              Apply
            </button>
            <Link href="/jobs" className="hidden text-sm text-accent lg:inline">
              Clear filters
            </Link>
          </div>
        </form>
      </aside>
    </>
  );
}

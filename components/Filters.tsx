"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { fieldClassName, FieldLabel, FieldLegend } from "@/components/ui/Field";
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
      <FieldLegend>{legend}</FieldLegend>
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
        <Button
          type="button"
          variant="secondary"
          aria-expanded={open}
          aria-controls={formId}
          onClick={() => setOpen(true)}
        >
          Filters{count ? ` (${count})` : ""}
        </Button>
        <Button href="/jobs" variant="ghost">
          Clear filters
        </Button>
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
        className={`${open ? "fixed inset-y-0 right-0 z-30 block w-[min(100%,22rem)] overflow-auto border-l border-line bg-bg p-5" : "hidden"} lg:sticky lg:top-4 lg:block lg:max-h-[calc(100vh-2rem)] lg:w-auto lg:overflow-auto lg:border-0 lg:bg-transparent lg:p-0`}
      >
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="font-display text-2xl">Filters</h2>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
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
            <FieldLabel>Search</FieldLabel>
            <input
              type="search"
              name="q"
              defaultValue={filters.q}
              placeholder="Title or company"
              className={fieldClassName}
            />
          </label>

          <label className="block text-sm">
            <FieldLabel>Sort</FieldLabel>
            <select name="sort" defaultValue={filters.sort} className={fieldClassName}>
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
            <FieldLegend>Years asked</FieldLegend>
            <p className="mt-2 text-xs leading-5 text-muted">Senior roles asking for 5 years or fewer: set the maximum to 5.</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="text-sm">
                Min
                <input
                  type="number"
                  name="yearsMin"
                  min={0}
                  max={40}
                  defaultValue={filters.yearsMin ?? ""}
                  className={fieldClassName}
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
                  className={fieldClassName}
                />
              </label>
            </div>
            <label className="mt-3 block text-sm">
              Roles with no years stated
              <select
                name="includeUnknownYears"
                defaultValue={filters.includeUnknownYears ? "1" : "0"}
                className={fieldClassName}
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
            <FieldLabel>Location</FieldLabel>
            <input
              type="search"
              name="location"
              defaultValue={filters.location}
              placeholder="City or country"
              className={fieldClassName}
            />
          </label>

          <CheckGroup legend="Employment" name="employment" selected={filters.employment} options={[...EMPLOYMENT_TYPES]} />

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
            <FieldLabel>Posted within</FieldLabel>
            <select name="posted" defaultValue={filters.posted} className={fieldClassName}>
              <option value="">Any time</option>
              {POSTED_WINDOWS.map((window) => (
                <option key={window.id} value={window.id}>
                  {window.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-center gap-4">
            <Button type="submit">Apply</Button>
            <Button href="/jobs" variant="ghost" className="hidden lg:inline-flex">
              Clear filters
            </Button>
          </div>
        </form>
      </aside>
    </>
  );
}

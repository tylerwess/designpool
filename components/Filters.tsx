"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { controlClassName } from "@/components/ui/Field";
import { activeFilterCount, filtersToQuery, type JobFilters } from "@/lib/filters";
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

function hrefFor(filters: JobFilters): string {
  const query = filtersToQuery(filters);
  return query ? `/jobs?${query}` : "/jobs";
}

function choiceLabel(name: string, selected: string[]): string {
  if (selected.length === 0) return name;
  if (selected.length === 1) return selected[0];
  return `${name} · ${selected.length}`;
}

function yearsLabel(filters: JobFilters): string {
  const { yearsMin, yearsMax, includeUnknownYears } = filters;
  if (yearsMin == null && yearsMax == null) return includeUnknownYears ? "Years" : "Years stated";
  if (yearsMin != null && yearsMax != null) return yearsMin === yearsMax ? `${yearsMin} yrs` : `${yearsMin}–${yearsMax} yrs`;
  if (yearsMin != null) return `${yearsMin}+ yrs`;
  return `Up to ${yearsMax} yrs`;
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="shrink-0">
      <path
        d="M4 6.5 8 10.5 12 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Option({
  type,
  name,
  value,
  defaultChecked,
  children,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  defaultChecked: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex h-11 items-center gap-3 rounded-full px-3 text-sm hover:bg-surface">
      <input type={type} name={name} value={value} defaultChecked={defaultChecked} className="size-4 shrink-0 accent-accent" />
      <span>{children}</span>
    </label>
  );
}

function Menu({
  id,
  open,
  label,
  active,
  clearHref,
  onToggle,
  children,
}: {
  id: string;
  open: boolean;
  label: string;
  active: boolean;
  clearHref?: string;
  onToggle: () => void;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [alignEnd, setAlignEnd] = useState(false);
  const chip = active ? "border-ink bg-ink text-bg" : "border-line bg-bg text-ink";
  function toggle() {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (rect) setAlignEnd(rect.left + rect.width / 2 > window.innerWidth / 2);
    onToggle();
  }

  return (
    <div ref={wrapRef} className="relative">
      <div className={`inline-flex h-9 items-center rounded-full border ${chip}`}>
        <button
          type="button"
          className={`inline-flex h-9 items-center gap-2 text-sm ${active && clearHref ? "pl-3.5 pr-2.5" : "px-3.5"}`}
          aria-expanded={open}
          aria-controls={id}
          onClick={toggle}
        >
          <span>{label}</span>
          <Chevron />
        </button>
        {active && clearHref ? (
          <Link
            href={clearHref}
            aria-label={`Clear ${label}`}
            className="inline-flex h-9 items-center border-l border-line pl-2.5 pr-3.5 text-sm"
          >
            ×
          </Link>
        ) : null}
      </div>
      <div
        id={id}
        className={`${open ? "block" : "hidden"} absolute z-30 mt-2 w-[min(20rem,calc(100vw-2.5rem))] rounded-2xl border border-line bg-bg p-2 ${alignEnd ? "right-0" : "left-0"}`}
      >
        <div className="max-h-80 overflow-auto">{children}</div>
        <div className="px-1 pt-2 pb-1">
          <Button type="submit" className="w-full">
            Show results
          </Button>
        </div>
      </div>
    </div>
  );
}

function FilterForm({ filters }: { filters: JobFilters }) {
  const rootRef = useRef<HTMLFormElement>(null);
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(null);
  const count = activeFilterCount(filters);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(null);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(null);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function toggle(id: string) {
    setOpen((current) => (current === id ? null : id));
  }

  const seniorityLabels = filters.seniority.map((level) => SENIORITY_LABELS[level]);
  const industryLabels = filters.industry.map((id) => INDUSTRIES.find((item) => item.id === id)?.label ?? id);
  const disciplineLabels = filters.discipline.map((id) => DISCIPLINES.find((item) => item.id === id)?.label ?? id);
  const workLabels = filters.work.map((id) => WORK_TYPES.find((item) => item.id === id)?.label ?? id);
  const employmentLabels = filters.employment.map((id) => EMPLOYMENT_TYPES.find((item) => item.id === id)?.label ?? id);
  const postedLabel = POSTED_WINDOWS.find((window) => window.id === filters.posted)?.label;
  const yearsActive = filters.yearsMin != null || filters.yearsMax != null || !filters.includeUnknownYears;

  return (
    <form ref={rootRef} action="/jobs" method="get" aria-label="Search roles" className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Title or company</span>
          <input
            type="search"
            name="q"
            defaultValue={filters.q}
            placeholder="Title or company"
            className={controlClassName}
          />
        </label>
        <Button type="submit" className="w-full shrink-0 sm:w-auto">
          Search
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Menu
          id={`${baseId}-sort`}
          open={open === "sort"}
          label={filters.sort === "company" ? "Company A–Z" : "Newest"}
          active={filters.sort !== "newest"}
          clearHref={hrefFor({ ...filters, sort: "newest" })}
          onToggle={() => toggle("sort")}
        >
          <Option type="radio" name="sort" value="newest" defaultChecked={filters.sort === "newest"}>
            Newest
          </Option>
          <Option type="radio" name="sort" value="company" defaultChecked={filters.sort === "company"}>
            Company A–Z
          </Option>
        </Menu>

        <Menu
          id={`${baseId}-seniority`}
          open={open === "seniority"}
          label={choiceLabel("Seniority", seniorityLabels)}
          active={filters.seniority.length > 0}
          clearHref={hrefFor({ ...filters, seniority: [] })}
          onToggle={() => toggle("seniority")}
        >
          {SENIORITY_LEVELS.map((level) => (
            <Option
              key={level}
              type="checkbox"
              name="seniority"
              value={level}
              defaultChecked={filters.seniority.includes(level)}
            >
              {SENIORITY_LABELS[level]}
            </Option>
          ))}
        </Menu>

        <Menu
          id={`${baseId}-location`}
          open={open === "location"}
          label={filters.location ? filters.location : "Location"}
          active={Boolean(filters.location)}
          clearHref={hrefFor({ ...filters, location: "" })}
          onToggle={() => toggle("location")}
        >
          <label className="block px-1 pb-2 text-sm">
            <span className="mb-1.5 block px-1 text-muted">City or country</span>
            <input
              type="search"
              name="location"
              defaultValue={filters.location}
              placeholder="City or country"
              className={controlClassName}
            />
          </label>
        </Menu>

        <Menu
          id={`${baseId}-work`}
          open={open === "work"}
          label={choiceLabel("Work type", workLabels)}
          active={filters.work.length > 0}
          clearHref={hrefFor({ ...filters, work: [] })}
          onToggle={() => toggle("work")}
        >
          {WORK_TYPES.map((option) => (
            <Option
              key={option.id}
              type="checkbox"
              name="work"
              value={option.id}
              defaultChecked={filters.work.includes(option.id)}
            >
              {option.label}
            </Option>
          ))}
        </Menu>

        <Menu
          id={`${baseId}-posted`}
          open={open === "posted"}
          label={postedLabel ? `Posted · ${postedLabel}` : "Date posted"}
          active={Boolean(filters.posted)}
          clearHref={hrefFor({ ...filters, posted: "" })}
          onToggle={() => toggle("posted")}
        >
          <Option type="radio" name="posted" value="" defaultChecked={!filters.posted}>
            Any time
          </Option>
          {POSTED_WINDOWS.map((window) => (
            <Option key={window.id} type="radio" name="posted" value={window.id} defaultChecked={filters.posted === window.id}>
              Past {window.label}
            </Option>
          ))}
        </Menu>

        <Menu
          id={`${baseId}-industry`}
          open={open === "industry"}
          label={choiceLabel("Industry", industryLabels)}
          active={filters.industry.length > 0}
          clearHref={hrefFor({ ...filters, industry: [] })}
          onToggle={() => toggle("industry")}
        >
          {INDUSTRIES.map((option) => (
            <Option
              key={option.id}
              type="checkbox"
              name="industry"
              value={option.id}
              defaultChecked={filters.industry.includes(option.id)}
            >
              {option.label}
            </Option>
          ))}
        </Menu>

        <Menu
          id={`${baseId}-discipline`}
          open={open === "discipline"}
          label={choiceLabel("Discipline", disciplineLabels)}
          active={filters.discipline.length > 0}
          clearHref={hrefFor({ ...filters, discipline: [] })}
          onToggle={() => toggle("discipline")}
        >
          {DISCIPLINES.map((option) => (
            <Option
              key={option.id}
              type="checkbox"
              name="discipline"
              value={option.id}
              defaultChecked={filters.discipline.includes(option.id)}
            >
              {option.label}
            </Option>
          ))}
        </Menu>

        <Menu
          id={`${baseId}-employment`}
          open={open === "employment"}
          label={choiceLabel("Employment", employmentLabels)}
          active={filters.employment.length > 0}
          clearHref={hrefFor({ ...filters, employment: [] })}
          onToggle={() => toggle("employment")}
        >
          {EMPLOYMENT_TYPES.map((option) => (
            <Option
              key={option.id}
              type="checkbox"
              name="employment"
              value={option.id}
              defaultChecked={filters.employment.includes(option.id)}
            >
              {option.label}
            </Option>
          ))}
        </Menu>

        <Menu
          id={`${baseId}-size`}
          open={open === "size"}
          label={choiceLabel("Company size", filters.size)}
          active={filters.size.length > 0}
          clearHref={hrefFor({ ...filters, size: [] })}
          onToggle={() => toggle("size")}
        >
          {SIZE_BUCKETS.map((bucket) => (
            <Option key={bucket} type="checkbox" name="size" value={bucket} defaultChecked={filters.size.includes(bucket)}>
              {bucket}
            </Option>
          ))}
        </Menu>

        <Menu
          id={`${baseId}-years`}
          open={open === "years"}
          label={yearsLabel(filters)}
          active={yearsActive}
          clearHref={hrefFor({ ...filters, yearsMin: null, yearsMax: null, includeUnknownYears: true })}
          onToggle={() => toggle("years")}
        >
          <div className="grid grid-cols-2 gap-2 px-1 pb-2">
            <label className="block text-sm">
              <span className="mb-1.5 block px-1 text-muted">Minimum</span>
              <input
                type="number"
                name="yearsMin"
                min={0}
                max={40}
                defaultValue={filters.yearsMin ?? ""}
                className={controlClassName}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block px-1 text-muted">Maximum</span>
              <input
                type="number"
                name="yearsMax"
                min={0}
                max={40}
                defaultValue={filters.yearsMax ?? ""}
                className={controlClassName}
              />
            </label>
          </div>
          <Option type="radio" name="includeUnknownYears" value="1" defaultChecked={filters.includeUnknownYears}>
            Include roles with no years stated
          </Option>
          <Option type="radio" name="includeUnknownYears" value="0" defaultChecked={!filters.includeUnknownYears}>
            Hide roles with no years stated
          </Option>
        </Menu>

        <Link
          href={hrefFor({ ...filters, salary: !filters.salary })}
          aria-pressed={filters.salary}
          className={`inline-flex h-9 items-center rounded-full border px-3.5 text-sm ${
            filters.salary ? "border-ink bg-ink text-bg" : "border-line bg-bg text-ink"
          }`}
        >
          Has salary
        </Link>

        {count > 0 ? (
          <Button href="/jobs" variant="ghost">
            Clear all
          </Button>
        ) : null}
      </div>
    </form>
  );
}

export function Filters({ filters }: { filters: JobFilters }) {
  return <FilterForm key={filtersToQuery(filters) || "all"} filters={filters} />;
}

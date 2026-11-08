import Link from "next/link";
import { jobsHref } from "@/lib/filters";
import { DISCIPLINES, type DisciplineId } from "@/lib/taxonomy";
import type { Listing } from "@/lib/types";

/** One-stroke 16px line icons, one per discipline. */
const ICONS: Record<DisciplineId, string> = {
  // App window
  product_design: "M4 3h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM2 6.5h12",
  // Flow between two steps
  ux: "M4 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM4 5.5v3a3 3 0 0 0 3 3h3.5",
  // Layout grid
  ui_visual: "M4 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM6.5 2v12M6.5 8H14",
  // Diamond mark
  brand: "M8 2l5 6-5 6-5-6Z",
  // Component tiles
  design_systems: "M3 2.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5ZM10 2.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5ZM3 9.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5ZM10 9.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Z",
  // Magnifier
  ux_research: "M7 2.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9ZM10.3 10.3 13.5 13.5",
  // Lines of copy
  content_design: "M2.5 4h11M2.5 8h11M2.5 12h7",
  // Ease-in-out curve
  motion: "M2 13.5C8 13.5 8 2.5 14 2.5",
  // Code brackets
  design_engineering: "M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4",
  // Flag
  design_leadership: "M3.5 14V2.5M3.5 3h9l-2 3 2 3h-9",
};

/** One chip per discipline, linking to the filtered job list. */
export function DisciplineChips({ jobs }: { jobs: Listing[] }) {
  const counts = new Map<string, number>();
  for (const job of jobs) {
    for (const discipline of job.disciplines) counts.set(discipline, (counts.get(discipline) ?? 0) + 1);
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {DISCIPLINES.map((discipline) => {
        const count = counts.get(discipline.id) ?? 0;
        return (
          <li key={discipline.id}>
            <Link href={jobsHref({ discipline: [discipline.id] })} className="discipline-chip">
              <svg className="discipline-chip-icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d={ICONS[discipline.id]} />
              </svg>
              {discipline.label}
              {jobs.length > 0 ? <span className="discipline-chip-count">{count}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

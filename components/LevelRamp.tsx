import Link from "next/link";
import type { CSSProperties } from "react";
import { jobsHref } from "@/lib/filters";
import { SENIORITY_LEVELS, type Seniority } from "@/lib/taxonomy";

/** Short names that fit under a swatch; the full labels live in SENIORITY_LABELS. */
const SHORT: Record<Seniority, string> = {
  new_grad: "Entry",
  mid: "Mid-senior",
  senior: "Senior",
  staff: "Staff",
  principal: "Principal",
  manager: "Manager",
  director: "Director",
  executive: "Executive",
};

/** The eight seniority levels as a color ramp, light to full brand blue, like a design-system scale. */
export function LevelRamp() {
  return (
    <ol className="level-ramp">
      {SENIORITY_LEVELS.map((level, i) => (
        <li key={level}>
          <Link
            href={jobsHref({ seniority: [level] })}
            className="level-ramp-step"
          >
            <span
              className="level-ramp-swatch"
              style={
                { "--step": (i + 1) / SENIORITY_LEVELS.length } as CSSProperties
              }
              aria-hidden="true"
            />
            <span className="level-ramp-token" aria-hidden="true">
              {(i + 1) * 100}
            </span>
            <span className="level-ramp-name">{SHORT[level]}</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

import type { CSSProperties } from "react";
import type { RoleTrendDay } from "@/lib/board";

const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });

/** Bars never drop below this share of the column, so a small day still reads as a bar. */
const MIN_SHARE = 0.12;

/**
 * Open roles over the last five days: past days in the soft accent, today in the accent on the
 * right. Bars grow from the baseline on load, staggered left to right. Days with no recorded
 * count show an empty dashed stub instead of an invented value.
 */
export function RoleTrend({ days }: { days: RoleTrendDay[] }) {
  const max = Math.max(1, ...days.map((day) => day.openRoles ?? 0));

  return (
    <figure className="role-trend" aria-label="Open roles, last five days">
      <ol className="role-trend-bars">
        {days.map((day, index) => {
          const label = day.isToday ? "Today" : WEEKDAY.format(new Date(`${day.day}T00:00:00Z`));
          const share = day.openRoles == null ? 0 : Math.max(MIN_SHARE, day.openRoles / max);
          return (
            <li key={day.day} className="role-trend-day">
              <span className="role-trend-value">{day.openRoles ?? "–"}</span>
              <span className="role-trend-track">
                {day.openRoles == null ? (
                  <span className="role-trend-bar is-empty" />
                ) : (
                  <span
                    className={`role-trend-bar ${day.isToday ? "is-today" : ""}`}
                    style={{ height: `${share * 100}%`, animationDelay: `${index * 90}ms` } as CSSProperties}
                  />
                )}
              </span>
              <span className={`role-trend-label ${day.isToday ? "is-today" : ""}`}>{label}</span>
              <span className="sr-only">
                {day.openRoles == null ? `${label}: no count recorded` : `${label}: ${day.openRoles} open roles`}
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

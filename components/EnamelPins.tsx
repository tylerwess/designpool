import Link from "next/link";
import type { CSSProperties } from "react";
import { PinLogo } from "@/components/PinLogo";
import { jobsHref } from "@/lib/filters";
import type { HiringPin } from "@/lib/hiring-pins";

/** A loose, hand-placed tilt so the row reads as pins stuck on a board. */
const TILTS = [-4, 3, -2, 5, -3, 2, -5, 4];

/**
 * Companies hiring right now, drawn as round enamel pins carrying only the company's mark,
 * with a notification badge for the role count. Each links to that company's roles.
 */
export function EnamelPins({ pins }: { pins: HiringPin[] }) {
  if (pins.length === 0) return null;
  return (
    <ul className="enamel-pins">
      {pins.map((pin, i) => {
        const roles = `${pin.roles} new ${pin.roles === 1 ? "role" : "roles"}`;
        return (
          <li key={pin.company}>
            <Link
              href={jobsHref({ q: pin.company })}
              className="enamel-pin"
              style={{ "--tilt": `${TILTS[i % TILTS.length]}deg` } as CSSProperties}
              aria-label={`${pin.company}, ${roles}`}
              title={pin.company}
            >
              <PinLogo name={pin.company} website={pin.website} />
              <span className="enamel-pin-badge" aria-hidden="true">
                {roles}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

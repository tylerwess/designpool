import Link from "next/link";
import { PinLogo } from "@/components/PinLogo";
import { ArrowIcon } from "@/components/ui/Button";
import { jobsHref } from "@/lib/filters";
import type { HiringPin } from "@/lib/hiring-pins";

/**
 * Companies hiring right now, as a hairline-ruled grid: each cell holds the company's mark and a
 * tertiary "8 roles →" link to that company's roles.
 */
export function EnamelPins({ pins }: { pins: HiringPin[] }) {
  if (pins.length === 0) return null;
  return (
    <ul className="enamel-pins">
      {pins.map((pin) => {
        const roles = `${pin.roles} ${pin.roles === 1 ? "role" : "roles"}`;
        return (
          <li key={pin.company}>
            <Link
              href={jobsHref({ q: pin.company })}
              className="enamel-pin"
              aria-label={`${pin.company}, ${pin.roles} new ${pin.roles === 1 ? "role" : "roles"}`}
              title={pin.company}
            >
              <PinLogo name={pin.company} website={pin.website} />
              <span className="enamel-pin-count" aria-hidden="true">
                {roles}
                <ArrowIcon />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

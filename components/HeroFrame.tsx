import type { ReactNode } from "react";

/**
 * Wraps the hero headline in a selected Figma component: a component label, corner handles,
 * and a size readout. All of it is decoration, hidden from assistive tech.
 */
export function HeroFrame({ children }: { children: ReactNode }) {
  return (
    <div className="hero-frame">
      <span className="hero-frame-label" aria-hidden="true">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M6 .8 8 2.8 6 4.8 4 2.8ZM6 7.2 8 9.2 6 11.2 4 9.2ZM2.8 4 4.8 6 2.8 8 .8 6ZM9.2 4 11.2 6 9.2 8 7.2 6Z" />
        </svg>
        Hero
      </span>
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <span
          key={pos}
          className="hero-handle"
          data-pos={pos}
          aria-hidden="true"
        />
      ))}
      <span className="hero-frame-size" aria-hidden="true">
        Fill × Hug
      </span>
      {children}
    </div>
  );
}

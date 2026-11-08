import type { ReactNode } from "react";

/**
 * Wraps the hero headline in a design-tool selection: a frame label, corner handles,
 * a size readout, and a named cursor. All of it is decoration, hidden from assistive tech.
 */
export function HeroFrame({ children }: { children: ReactNode }) {
  return (
    <div className="hero-frame">
      <span className="hero-frame-label" aria-hidden="true">
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M3 0v12M9 0v12M0 3h12M0 9h12" />
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
      <span className="hero-cursor" aria-hidden="true">
        <svg viewBox="0 0 16 20" aria-hidden="true">
          <path d="M1 1l14 8.5-6.2 1.3L5.6 18z" />
        </svg>
        <span className="hero-cursor-name">Hiring manager</span>
      </span>
      {children}
    </div>
  );
}

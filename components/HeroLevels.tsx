"use client";

import { useEffect, useState } from "react";

/** Levels that read as "for ___ design professionals"; manager and up don't fit the phrase. */
const LEVELS = ["entry-level", "mid-senior", "senior", "staff", "principal"];

/** How long a finished level stays up before it's erased. */
const HOLD_MS = 2200;
const TYPE_MS = 70;
const ERASE_MS = 35;
/** A short beat on the empty line before the next level is typed. */
const GAP_MS = 300;

/** The hero's level, typed out and erased one character at a time, inside a selected Figma component frame. */
export function HeroLevels() {
  const [text, setText] = useState(LEVELS[0]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    (async () => {
      for (
        let current = 0;
        !cancelled;
        current = (current + 1) % LEVELS.length
      ) {
        await wait(HOLD_MS);
        for (let n = LEVELS[current].length - 1; n >= 0; n--) {
          if (cancelled) return;
          setText(LEVELS[current].slice(0, n));
          await wait(ERASE_MS);
        }
        const next = (current + 1) % LEVELS.length;
        if (cancelled) return;
        await wait(GAP_MS);
        for (let n = 1; n <= LEVELS[next].length; n++) {
          if (cancelled) return;
          setText(LEVELS[next].slice(0, n));
          await wait(TYPE_MS);
        }
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <span className="sr-only">{LEVELS.join(", ")}</span>
      <span
        className="hero-levels"
       
        aria-hidden="true"
      >
        <span className="hero-frame-label">
          <svg viewBox="0 0 12 12">
            <path d="M6 .8 8 2.8 6 4.8 4 2.8ZM6 7.2 8 9.2 6 11.2 4 9.2ZM2.8 4 4.8 6 2.8 8 .8 6ZM9.2 4 11.2 6 9.2 8 7.2 6Z" />
          </svg>
          Level
        </span>
        <span className="hero-frame-box">
          {(["tl", "tr", "bl", "br"] as const).map((pos) => (
            <span key={pos} className="hero-handle" data-pos={pos} />
          ))}
        </span>
        <span className="hero-levels-text">{text}</span>
      </span>
    </>
  );
}

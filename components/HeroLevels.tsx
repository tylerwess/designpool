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

/** The hero's level, typed out and erased one character at a time. */
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
      <span className="hero-levels" aria-hidden="true">
        {text}
      </span>
    </>
  );
}

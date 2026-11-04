"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** Levels that read as "for ___ designers"; manager and up don't fit the phrase. */
const LEVELS = ["entry-level", "mid-senior", "senior", "staff", "principal"];

const SLOT_INTERVAL_MS = 2000;

/** Five rising bars, filled up to the level: entry-level lights one, principal all five. */
function LevelIcon({ level }: { level: number }) {
  return (
    <svg className="hero-levels-icon" viewBox="0 0 20 16" aria-hidden="true">
      {LEVELS.map((_, i) => (
        <rect
          key={i}
          x={i * 4}
          y={12 - i * 3}
          width="3"
          height={4 + i * 3}
          rx="1"
          className={i <= level ? "is-on" : undefined}
        />
      ))}
    </svg>
  );
}

/** Slot reel for the hero headline, like the footer's source reel; the box eases to each word's width. */
export function HeroLevels() {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState<number>();
  const items = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % LEVELS.length);
    }, SLOT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const measure = () => setWidth(items.current[index]?.offsetWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [index]);

  return (
    <>
      <span className="sr-only">{LEVELS.join(", ")}</span>
      <span className="hero-levels" aria-hidden="true" style={{ width }}>
        <span className="slot-reel-strip" style={{ transform: `translateY(-${index * 1.1}em)` }}>
          {LEVELS.map((level, i) => (
            <span
              key={level}
              ref={(node) => {
                items.current[i] = node;
              }}
              className="hero-levels-item"
            >
              <LevelIcon level={i} />
              {level}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

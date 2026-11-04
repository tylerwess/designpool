"use client";

import { useEffect, useState } from "react";

/** Levels that read as "for ___ design professionals"; manager and up don't fit the phrase. */
const LEVELS = ["entry-level", "mid-senior", "senior", "staff", "principal"];

/** How long a finished level stays up before the next one streams in. */
const HOLD_MS = 2200;
const CLEAR_MS = 180;
/** A short beat before the first token, like a model thinking. */
const THINK_MS = 250;

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

/** Splits a word into 1-3 character tokens, the uneven bursts a model streams in. */
function tokenize(word: string): string[] {
  const tokens: string[] = [];
  for (let at = 0; at < word.length; ) {
    const size = 1 + Math.floor(Math.random() * 3);
    tokens.push(word.slice(at, at + size));
    at += size;
  }
  return tokens;
}

/** The hero's level, streamed in token by token as if a model were answering. */
export function HeroLevels() {
  const [index, setIndex] = useState(0);
  const [tokens, setTokens] = useState([LEVELS[0]]);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });

    (async () => {
      for (let next = 1; !cancelled; next = (next + 1) % LEVELS.length) {
        await wait(HOLD_MS);
        if (cancelled) return;
        setClearing(true);
        await wait(CLEAR_MS);
        if (cancelled) return;
        setIndex(next);
        setTokens([]);
        setClearing(false);
        await wait(THINK_MS);
        for (const token of tokenize(LEVELS[next])) {
          if (cancelled) return;
          setTokens((current) => [...current, token]);
          await wait(45 + Math.random() * 75);
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
      <span className={`hero-levels${clearing ? " is-clearing" : ""}`} aria-hidden="true">
        <LevelIcon level={index} />
        <span>
          {tokens.map((token, i) => (
            <span key={`${index}-${i}`} className="hero-token">
              {token}
            </span>
          ))}
        </span>
      </span>
    </>
  );
}

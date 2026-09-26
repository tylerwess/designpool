"use client";

import { useEffect, useState } from "react";

export function Odometer({ value }: { value: number }) {
  const digits = String(Math.max(0, Math.floor(value))).split("");
  const [shown, setShown] = useState(() => digits.map(() => 0));

  useEffect(() => {
    const next = String(Math.max(0, Math.floor(value))).split("").map((digit) => Number(digit));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(next);
      return;
    }
    const frame = requestAnimationFrame(() => setShown(next));
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <span className="odometer" aria-label={String(value)}>
      {digits.map((_, index) => (
        <span key={`${digits.length}-${index}`} className="odometer-digit">
          <span
            className="odometer-reel"
            style={{
              transform: `translateY(-${shown[index] ?? 0}em)`,
              transitionDelay: `${index * 70}ms`,
            }}
          >
            {Array.from({ length: 10 }, (_, number) => (
              <span key={number} className="odometer-face">
                {number}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

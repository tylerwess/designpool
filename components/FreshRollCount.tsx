"use client";

import { useEffect, useState, type CSSProperties } from "react";

export function FreshRollCount({ count, prefix }: { count: number; prefix?: string }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const digits = String(count).split("").map(Number);

  return (
    <span className="shadow-roll" role="status" aria-label={`${prefix ?? ""}${count}`}>
      {prefix ? <span aria-hidden="true">{prefix}</span> : null}
      {digits.map((digit, index) => (
        <span
          key={index}
          className="shadow-roll-digit"
          aria-hidden="true"
          style={{ "--roll-t": revealed ? `-${digit}em` : "0em" } as CSSProperties}
        />
      ))}
    </span>
  );
}

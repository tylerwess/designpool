"use client";

import { useEffect, useState } from "react";

function OdometerDigit({ digit }: { digit: number }) {
  return (
    <span className="odometer-digit" aria-hidden="true">
      <span className="odometer-digit-strip" style={{ transform: `translateY(-${digit}em)` }}>
        {Array.from({ length: 10 }, (_, value) => (
          <span key={value} className="odometer-digit-cell">
            {value}
          </span>
        ))}
      </span>
    </span>
  );
}

export function FreshListingsCount({
  count,
  prefix,
  className = "",
}: {
  count: number;
  prefix?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    setDisplay(0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(count);
      return;
    }

    const duration = 900;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * count));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count]);

  const digits = String(display)
    .padStart(String(count).length, "0")
    .split("")
    .map(Number);

  return (
    <span className={`inline-flex items-center font-display ${className}`.trim()}>
      {prefix ? <span aria-hidden="true">{prefix}</span> : null}
      <span className="odometer" role="status" aria-live="off">
        {digits.map((digit, index) => (
          <OdometerDigit key={index} digit={digit} />
        ))}
      </span>
    </span>
  );
}

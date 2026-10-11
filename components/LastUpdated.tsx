"use client";

import { useEffect, useState } from "react";

const FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

/** Formats on the client so the time shows in the visitor's own time zone. */
export function LastUpdated({ iso, className = "" }: { iso: string; className?: string }) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(FORMAT.format(new Date(iso)));
  }, [iso]);

  return (
    <p className={`min-h-[1.4em] text-xs text-muted ${className}`.trim()}>
      {label ? (
        <>
          Last updated <time dateTime={iso}>{label}</time>
        </>
      ) : null}
    </p>
  );
}

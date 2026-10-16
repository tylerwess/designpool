"use client";

import { useSyncExternalStore } from "react";

const FORMAT = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });

const noopSubscribe = () => () => {};

/** False during server render and hydration, true once running in the browser. */
function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

function CloudIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 text-accent">
      <path
        d="M7 18.5h10.25a4.25 4.25 0 0 0 .6-8.46A6 6 0 0 0 6.3 11.1 3.75 3.75 0 0 0 7 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Pill showing when the listings were last refreshed. Formats on the client so the time is in the
 * visitor's own time zone, and renders nothing until then.
 */
export function LastUpdated({ iso, className = "" }: { iso: string; className?: string }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  const label = FORMAT.format(new Date(iso));

  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-[12px] border border-line bg-bg px-3 py-1.5 text-xs text-muted ${className}`.trim()}
    >
      <CloudIcon />
      <span>
        Jobs updated <time dateTime={iso}>{label}</time>
      </span>
    </p>
  );
}

"use client";

import { useState, useSyncExternalStore } from "react";

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
 * Pill showing when the listings were last refreshed, with a close button that hides it for this page
 * view only (it returns on refresh). Formats on the client so the time is in the visitor's own time
 * zone, and renders nothing until then.
 */
export function LastUpdated({ iso, className = "" }: { iso: string; className?: string }) {
  const isClient = useIsClient();
  const [dismissed, setDismissed] = useState(false);
  if (!isClient || dismissed) return null;
  const label = FORMAT.format(new Date(iso));


  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-b-[12px] border border-t-0 border-accent/20 bg-accent/10 py-1.5 pr-1.5 pl-3 text-xs text-ink ${className}`.trim()}
    >
      <CloudIcon />
      <span>
        Jobs updated <time dateTime={iso}>{label}</time>
      </span>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss update notice"
        className="ml-1 inline-flex size-6 items-center justify-center rounded-[8px] text-muted hover:bg-accent/15 hover:text-ink"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </p>
  );
}

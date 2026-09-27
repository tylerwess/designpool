"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M4 6.5 8 10.5 12 6.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExpandableDescription({ html, empty }: { html: string; empty: string }) {
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    function measure() {
      if (!node || open) return;
      setOverflows(node.scrollHeight > node.clientHeight + 1);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [html, open]);

  if (!html) {
    return <p className="mt-4 max-w-2xl text-base text-muted">{empty}</p>;
  }

  return (
    <div className="mt-4 max-w-2xl">
      <div
        id={contentId}
        ref={contentRef}
        className={`job-description${open ? " is-expanded" : ""}${!open && overflows ? " is-clamped" : ""}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {overflows ? (
        <div className="mt-3">
          <Button
            type="button"
            variant="ghost"
            className="gap-1"
            aria-expanded={open}
            aria-controls={contentId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Show less" : "Read more"}
            <Chevron open={open} />
          </Button>
        </div>
      ) : null}
    </div>
  );
}

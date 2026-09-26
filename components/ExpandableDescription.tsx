"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";

export function ExpandableDescription({
  preview,
  rest,
  empty,
}: {
  preview: string;
  rest: string;
  empty: string;
}) {
  const [open, setOpen] = useState(false);
  const restId = useId();

  if (!preview) {
    return <p className="mt-4 max-w-2xl text-base text-muted">{empty}</p>;
  }

  return (
    <div className="mt-4 max-w-2xl text-base leading-7">
      <div className="whitespace-pre-wrap">{preview}</div>
      {rest ? (
        <>
          <div id={restId} hidden={!open} className="mt-4 whitespace-pre-wrap">
            {rest}
          </div>
          <div className="mt-3">
            <Button
              type="button"
              variant="ghost"
              aria-expanded={open}
              aria-controls={restId}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? "Show less" : "Read more"}
            </Button>
          </div>
        </>
      ) : null}
    </div>
  );
}

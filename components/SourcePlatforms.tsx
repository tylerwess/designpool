"use client";

import { useEffect, useState } from "react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export const SOURCE_PLATFORMS = [
  { name: "Greenhouse", website: "https://www.greenhouse.com" },
  { name: "Ashby", website: "https://www.ashbyhq.com" },
  { name: "Lever", website: "https://www.lever.co" },
];

const SLOT_INTERVAL_MS = 2000;

export function SourcePlatforms({
  className = "",
  align = "start",
}: {
  className?: string;
  align?: "start" | "center";
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      setIndex((current) => (current + 1) % SOURCE_PLATFORMS.length);
    }, SLOT_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`slot-reel h-7 overflow-hidden font-display text-ink ${className}`.trim()}>
      <div className="slot-reel-strip" style={{ transform: `translateY(-${index * 1.75}rem)` }}>
        {SOURCE_PLATFORMS.map((platform) => (
          <div key={platform.name} className={`slot-reel-item flex h-7 items-center gap-2 ${align === "center" ? "justify-center" : ""}`.trim()}>
            <CompanyLogo name={platform.name} website={platform.website} />
            {platform.name}
          </div>
        ))}
      </div>
    </div>
  );
}

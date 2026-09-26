"use client";

import Image from "next/image";
import { useState } from "react";
import { companyInitial, companyLogoSrc } from "@/lib/company-logo";

const SIZES = {
  sm: { box: "h-7 w-7 rounded-[0.6rem]", type: "text-xs", pixels: 28 },
  lg: { box: "h-12 w-12 rounded-[0.95rem] sm:h-14 sm:w-14 sm:rounded-[1.1rem]", type: "text-lg", pixels: 56 },
} as const;

export function CompanyLogo({
  name,
  website,
  size = "sm",
}: {
  name: string;
  website?: string | null;
  size?: keyof typeof SIZES;
}) {
  const src = companyLogoSrc(website);
  const [failed, setFailed] = useState(!src);
  const showImage = Boolean(src) && !failed;
  const spec = SIZES[size];

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-line bg-transparent ${spec.box}`}
      role="img"
      aria-label={`${name} logo`}
    >
      {showImage ? (
        <Image
          src={src!}
          alt=""
          width={spec.pixels}
          height={spec.pixels}
          className="h-[68%] w-[68%] object-contain"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true" className={`font-display leading-none text-ink ${spec.type}`}>
          {companyInitial(name)}
        </span>
      )}
    </span>
  );
}

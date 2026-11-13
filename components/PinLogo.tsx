"use client";

import Image from "next/image";
import { useState } from "react";
import { companyInitial, companyLogoSrc } from "@/lib/company-logo";

/** The company's mark set in a white enamel disc; the initial stands in when no mark loads. */
export function PinLogo({ name, website }: { name: string; website: string | null }) {
  const src = companyLogoSrc(website);
  const [failed, setFailed] = useState(!src);

  return (
    <span className="enamel-pin-logo" aria-hidden="true">
      {src && !failed ? (
        <Image src={src} alt="" width={64} height={64} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="enamel-pin-initial">{companyInitial(name)}</span>
      )}
    </span>
  );
}

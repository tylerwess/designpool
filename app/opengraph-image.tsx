import { ImageResponse } from "next/og";
import { PALETTES } from "@/lib/design-tokens";
import { siteUrl } from "@/lib/site";

export const alt = "Designpool, a job board for design roles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const color = PALETTES.light;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: color.bg,
          color: color.ink,
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: "0.08em", color: color.muted }}>DESIGNPOOL</div>
        <div style={{ display: "flex", fontSize: 64, lineHeight: 1.05, maxWidth: 920 }}>
          The design job board that respects your time.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: color.muted }}>Filters that matter · 30 days · {siteUrl().host}</div>
      </div>
    ),
    { ...size },
  );
}

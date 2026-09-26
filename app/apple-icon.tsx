import { ImageResponse } from "next/og";
import { BrandMark, loadDisplayFont } from "@/lib/brand-mark";
import { TYPE_DISPLAY } from "@/lib/design-tokens";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const font = await loadDisplayFont();
  return new ImageResponse(<BrandMark size={size.width} />, {
    ...size,
    fonts: [{ name: TYPE_DISPLAY.family, data: font, weight: TYPE_DISPLAY.weight, style: "normal" }],
  });
}

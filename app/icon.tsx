import { ImageResponse } from "next/og";
import { BrandMark, loadDisplayFont } from "@/lib/brand-mark";
import { TYPE_DISPLAY } from "@/lib/design-tokens";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const font = await loadDisplayFont();
  return new ImageResponse(<BrandMark size={size.width} />, {
    ...size,
    fonts: [{ name: TYPE_DISPLAY.family, data: font, weight: TYPE_DISPLAY.weight, style: "normal" }],
  });
}

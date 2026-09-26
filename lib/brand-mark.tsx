import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties, ReactElement } from "react";
import { PALETTES, TYPE_DISPLAY } from "@/lib/design-tokens";

export async function loadDisplayFont(): Promise<ArrayBuffer> {
  const bytes = await readFile(join(process.cwd(), "fonts/FjallaOne-Regular.ttf"));
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

export function brandMarkStyle(size: number): CSSProperties {
  const fontSize = Math.round(size * 0.46);
  const tracking = Number.parseFloat(TYPE_DISPLAY.heroTracking) * fontSize;
  return {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: PALETTES.light.accent,
    color: PALETTES.light["on-accent"],
    borderRadius: Math.round(size * 0.25),
    fontFamily: TYPE_DISPLAY.family,
    fontWeight: TYPE_DISPLAY.weight,
    fontSize,
    letterSpacing: `${tracking}px`,
    lineHeight: 1,
  };
}

export function BrandMark({ size }: { size: number }): ReactElement {
  return <div style={brandMarkStyle(size)}>pool</div>;
}

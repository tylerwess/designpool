"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { SOURCE_PLATFORMS } from "@/lib/source-platforms";

/** At or above this width the nodes sit beside the chip; below it they stack above and below it. */
const WIDE_MIN = 420;

const NODE_W = 132;
const NODE_H = 40;
const CHIP_W = 104;
const CHIP_H = 54;
/** Vertical room for a trace between a node and the chip in the stacked layout. */
const STACK_GAP = 40;

type Name = (typeof SOURCE_PLATFORMS)[number]["name"];
type Box = { x: number; y: number };
type Pin = { x: number; y: number; w: number; h: number };
type Node = Box & { name: Name; trace: string; delay: string };
type Layout = { height: number; chip: Box; nodes: Node[]; pins: Pin[] };

const DELAYS: Record<Name, string> = { Greenhouse: "0s", Ashby: "1s", Lever: "2s" };

/** Short pin on a chip edge: horizontal on the sides, vertical on the top and bottom. */
const sidePin = (x: number, y: number): Pin => ({ x, y: y - 3, w: 5, h: 6 });
const endPin = (x: number, y: number): Pin => ({ x: x - 3, y, w: 6, h: 5 });

/** Greenhouse and Ashby on the left, Lever on the right; the chip stays centered and the traces stretch. */
function wideLayout(width: number): Layout {
  const height = 150;
  const chip = { x: (width - CHIP_W) / 2, y: 48 };
  const chipRight = chip.x + CHIP_W;
  const jog = (NODE_W + chip.x) / 2;
  const nodes: Node[] = [
    { name: "Greenhouse", x: 0, y: 4, trace: `M${NODE_W} 24 H${jog} V64 H${chip.x}`, delay: DELAYS.Greenhouse },
    { name: "Ashby", x: 0, y: 106, trace: `M${NODE_W} 126 H${jog} V86 H${chip.x}`, delay: DELAYS.Ashby },
    { name: "Lever", x: width - NODE_W, y: 55, trace: `M${width - NODE_W} 75 H${chipRight}`, delay: DELAYS.Lever },
  ];
  const pins = [
    sidePin(chip.x - 5, 64),
    sidePin(chip.x - 5, 86),
    sidePin(chipRight, 75),
    ...[20, 36, 52, 68, 84].flatMap((offset) => [
      endPin(chip.x + offset, chip.y - 5),
      endPin(chip.x + offset, chip.y + CHIP_H),
    ]),
  ];
  return { height, chip, nodes, pins };
}

/** Phones: Greenhouse and Ashby above the chip, Lever below it. */
function stackedLayout(width: number): Layout {
  const chip = { x: (width - CHIP_W) / 2, y: NODE_H + STACK_GAP };
  const chipBottom = chip.y + CHIP_H;
  const lever = { x: (width - NODE_W) / 2, y: chipBottom + STACK_GAP };
  const height = lever.y + NODE_H;
  const bend = NODE_H + STACK_GAP / 2;
  const inLeft = chip.x + 30;
  const inRight = chip.x + CHIP_W - 30;
  const nodes: Node[] = [
    {
      name: "Greenhouse",
      x: 0,
      y: 0,
      trace: `M${NODE_W / 2} ${NODE_H} V${bend} H${inLeft} V${chip.y}`,
      delay: DELAYS.Greenhouse,
    },
    {
      name: "Ashby",
      x: width - NODE_W,
      y: 0,
      trace: `M${width - NODE_W / 2} ${NODE_H} V${bend} H${inRight} V${chip.y}`,
      delay: DELAYS.Ashby,
    },
    { name: "Lever", ...lever, trace: `M${width / 2} ${lever.y} V${chipBottom}`, delay: DELAYS.Lever },
  ];
  const pins = [
    endPin(inLeft, chip.y - 5),
    endPin(inRight, chip.y - 5),
    endPin(width / 2, chipBottom),
    ...[14, 27, 40].flatMap((offset) => [
      sidePin(chip.x - 5, chip.y + offset),
      sidePin(chip.x + CHIP_W, chip.y + offset),
    ]),
  ];
  return { height, chip, nodes, pins };
}

/**
 * Greenhouse, Ashby, and Lever feeding the Designpool chip, each pulse in that platform's icon color.
 * Drawn at the container's real pixel width so nothing scales: the SVG holds only traces and pins,
 * and the nodes and chip are HTML on top (Safari misplaces HTML inside a scaled SVG).
 */
export function SourceCircuit({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const layout = width == null ? null : width >= WIDE_MIN ? wideLayout(width) : stackedLayout(width);

  return (
    <div
      ref={ref}
      className={`source-circuit relative w-full ${className}`.trim()}
      style={{ height: layout?.height ?? 150 }}
      role="img"
      aria-label="Listings flow into Designpool from Greenhouse, Ashby, and Lever."
    >
      {layout && width != null ? (
        <>
          <svg width={width} height={layout.height} viewBox={`0 0 ${width} ${layout.height}`} className="absolute inset-0" aria-hidden="true">
            {layout.nodes.map((node) => (
              <path key={`${node.name}-bg`} d={node.trace} className="trace-bg" />
            ))}
            {layout.nodes.map((node) => {
              const color = SOURCE_PLATFORMS.find((item) => item.name === node.name)!.color;
              return (
                <path
                  key={`${node.name}-flow`}
                  d={node.trace}
                  pathLength={100}
                  className="trace-flow"
                  style={{ "--trace-color": color, animationDelay: node.delay } as CSSProperties}
                />
              );
            })}
            {layout.pins.map((pin) => (
              <rect key={`${pin.x}-${pin.y}`} x={pin.x} y={pin.y} width={pin.w} height={pin.h} rx={1} className="chip-pin" />
            ))}
          </svg>

          <div className="chip-body chip-label absolute" style={{ left: layout.chip.x, top: layout.chip.y, width: CHIP_W, height: CHIP_H }} aria-hidden="true">
            Design<span className="chip-label-pool">pool</span>
          </div>

          {layout.nodes.map((node) => {
            const platform = SOURCE_PLATFORMS.find((item) => item.name === node.name)!;
            return (
              <div
                key={node.name}
                className="circuit-node circuit-node-label absolute"
                style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
                aria-hidden="true"
              >
                <CompanyLogo name={platform.name} website={platform.website} />
                {platform.name}
              </div>
            );
          })}
        </>
      ) : null}
    </div>
  );
}

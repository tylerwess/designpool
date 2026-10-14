"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { SOURCE_PLATFORMS } from "@/lib/source-platforms";

/** Below this width the whole drawing scales down instead of the traces getting shorter. */
const MIN_W = 410;
const VIEW_H = 150;

const NODE_W = 132;
const NODE_H = 40;
const CHIP_W = 104;
const CHIP_H = 54;
const CHIP_Y = 48;

type Name = (typeof SOURCE_PLATFORMS)[number]["name"];

type Node = {
  name: Name;
  x: number;
  y: number;
  /** Trace from the node edge into a chip pin, drawn node → chip so the pulse flows inward. */
  trace: string;
  /** Where the trace meets the chip, for its pin. */
  pin: { x: number; y: number };
  delay: string;
};

/** Nodes and chip keep their size; the chip stays centered and the traces stretch to fill the width. */
function layout(width: number) {
  const chipX = (width - CHIP_W) / 2;
  const chipRight = chipX + CHIP_W;
  const jog = (NODE_W + chipX) / 2;
  const nodes: Node[] = [
    {
      name: "Greenhouse",
      x: 0,
      y: 4,
      trace: `M${NODE_W} 24 H${jog} V64 H${chipX}`,
      pin: { x: chipX - 5, y: 64 },
      delay: "0s",
    },
    {
      name: "Ashby",
      x: 0,
      y: 106,
      trace: `M${NODE_W} 126 H${jog} V86 H${chipX}`,
      pin: { x: chipX - 5, y: 86 },
      delay: "1s",
    },
    {
      name: "Lever",
      x: width - NODE_W,
      y: 55,
      trace: `M${width - NODE_W} 75 H${chipRight}`,
      pin: { x: chipRight, y: 75 },
      delay: "2s",
    },
  ];
  const edgePins = [20, 36, 52, 68, 84].map((offset) => chipX + offset);
  return { chipX, nodes, edgePins };
}

/** Greenhouse, Ashby, and Lever feeding the Designpool chip, each pulse in that platform's icon color. */
export function SourceCircuit({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(MIN_W);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(MIN_W, Math.round(entry.contentRect.width)));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const { chipX, nodes, edgePins } = layout(width);

  return (
    <div ref={ref} className={`source-circuit w-full ${className}`.trim()}>
      <svg
        viewBox={`0 0 ${width} ${VIEW_H}`}
        role="img"
        aria-labelledby="source-circuit-title"
        className="block h-auto w-full"
      >
        <title id="source-circuit-title">Listings flow into Designpool from Greenhouse, Ashby, and Lever.</title>

        {nodes.map((node) => (
          <path key={`${node.name}-bg`} d={node.trace} className="trace-bg" />
        ))}
        {nodes.map((node) => {
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

        {edgePins.map((x) => (
          <g key={x}>
            <rect x={x - 3} y={CHIP_Y - 5} width={6} height={5} rx={1} className="chip-pin" />
            <rect x={x - 3} y={CHIP_Y + CHIP_H} width={6} height={5} rx={1} className="chip-pin" />
          </g>
        ))}
        {nodes.map((node) => (
          <rect key={`${node.name}-pin`} x={node.pin.x} y={node.pin.y - 3} width={5} height={6} rx={1} className="chip-pin" />
        ))}

        <rect x={chipX} y={CHIP_Y} width={CHIP_W} height={CHIP_H} rx={12} className="chip-body" />
        <foreignObject x={chipX} y={CHIP_Y} width={CHIP_W} height={CHIP_H}>
          <div className="chip-label">
            Design<span className="chip-label-pool">pool</span>
          </div>
        </foreignObject>

        {nodes.map((node) => {
          const platform = SOURCE_PLATFORMS.find((item) => item.name === node.name)!;
          return (
            <g key={node.name}>
              <rect x={node.x} y={node.y} width={NODE_W} height={NODE_H} rx={10} className="circuit-node" />
              <foreignObject x={node.x} y={node.y} width={NODE_W} height={NODE_H}>
                <div className="circuit-node-label">
                  <CompanyLogo name={platform.name} website={platform.website} />
                  {platform.name}
                </div>
              </foreignObject>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

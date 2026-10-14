import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { SOURCE_PLATFORMS } from "@/lib/source-platforms";

const VIEW_W = 410;
const VIEW_H = 150;

const NODE_W = 132;
const NODE_H = 40;

const CHIP = { x: 154, y: 48, w: 104, h: 54 };
const CHIP_RIGHT = CHIP.x + CHIP.w;

type Platform = (typeof SOURCE_PLATFORMS)[number];

type Node = {
  name: Platform["name"];
  x: number;
  y: number;
  /** Trace from the node edge into a chip pin, drawn node → chip so the pulse flows inward. */
  trace: string;
  /** Where the trace meets the chip, for its pin. */
  pin: { x: number; y: number };
  delay: string;
};

const NODES: Node[] = [
  {
    name: "Greenhouse",
    x: 0,
    y: 4,
    trace: `M${NODE_W} 24 H143 V64 H${CHIP.x}`,
    pin: { x: CHIP.x - 5, y: 64 },
    delay: "0s",
  },
  {
    name: "Ashby",
    x: 0,
    y: 106,
    trace: `M${NODE_W} 126 H143 V86 H${CHIP.x}`,
    pin: { x: CHIP.x - 5, y: 86 },
    delay: "1s",
  },
  {
    name: "Lever",
    x: VIEW_W - NODE_W,
    y: 55,
    trace: `M${VIEW_W - NODE_W} 75 H${CHIP_RIGHT}`,
    pin: { x: CHIP_RIGHT, y: 75 },
    delay: "2s",
  },
];

/** Decorative pins along the chip's top and bottom edges. */
const EDGE_PINS = [20, 36, 52, 68, 84].map((offset) => CHIP.x + offset);

/** Greenhouse, Ashby, and Lever feeding the Designpool chip, with a pulse running down each trace. */
export function SourceCircuit({ className = "" }: { className?: string }) {
  return (
    <div className={`source-circuit w-[25.625rem] max-w-full ${className}`.trim()}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        role="img"
        aria-labelledby="source-circuit-title"
        className="block h-auto w-full"
      >
        <title id="source-circuit-title">Listings flow into Designpool from Greenhouse, Ashby, and Lever.</title>

        {NODES.map((node) => (
          <path key={`${node.name}-bg`} d={node.trace} className="trace-bg" />
        ))}
        {NODES.map((node) => (
          <path
            key={`${node.name}-flow`}
            d={node.trace}
            pathLength={100}
            className="trace-flow"
            style={{ animationDelay: node.delay }}
          />
        ))}

        {EDGE_PINS.map((x) => (
          <g key={x}>
            <rect x={x - 3} y={CHIP.y - 5} width={6} height={5} rx={1} className="chip-pin" />
            <rect x={x - 3} y={CHIP.y + CHIP.h} width={6} height={5} rx={1} className="chip-pin" />
          </g>
        ))}
        {NODES.map((node) => (
          <rect key={`${node.name}-pin`} x={node.pin.x} y={node.pin.y - 3} width={5} height={6} rx={1} className="chip-pin" />
        ))}

        <rect x={CHIP.x} y={CHIP.y} width={CHIP.w} height={CHIP.h} rx={12} className="chip-body" />
        <foreignObject x={CHIP.x} y={CHIP.y} width={CHIP.w} height={CHIP.h}>
          <div className="chip-label">
            Design<span className="chip-label-pool">pool</span>
          </div>
        </foreignObject>

        {NODES.map((node) => {
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

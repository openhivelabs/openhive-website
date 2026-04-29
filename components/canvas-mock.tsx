import {
  Crown,
  MagnifyingGlass,
  ChartLineUp,
  ChartBar,
  PencilSimple,
  PaintBrush,
  User,
} from "@phosphor-icons/react/dist/ssr";
import type { ComponentType } from "react";

type IconCmp = ComponentType<{
  className?: string;
  weight?: "regular" | "bold" | "fill";
}>;

type Pos = { x: number; y: number };
type AgentSpec = {
  id: string;
  pos: Pos; // node TOP-LEFT in viewBox coords
  role: string;
  model: string;
  icon: IconCmp;
  isLead?: boolean;
  providerColor?: string;
};

/* viewBox: 1000 × 460
   node: 240 × 72
   Three-level org chart with 6 agents across multiple providers. */
const NODE_W = 240;
const NODE_H = 72;
const VB_W = 1000;
const VB_H = 460;

const NODES: AgentSpec[] = [
  // L1
  { id: "lead", pos: { x: 380, y: 30 }, role: "Lead", model: "claude-opus-4-7", icon: Crown, isLead: true, providerColor: "#cc785c" },
  // L2
  { id: "research", pos: { x: 160, y: 190 }, role: "Researcher", model: "gpt-5.5", icon: MagnifyingGlass, providerColor: "#10b981" },
  { id: "strategy", pos: { x: 600, y: 190 }, role: "Strategist", model: "gpt-5.5", icon: ChartLineUp, providerColor: "#10b981" },
  // L3
  { id: "analyst", pos: { x: 20, y: 350 }, role: "Analyst", model: "gpt-5.4-mini", icon: ChartBar, providerColor: "#a3a3a3" },
  { id: "writer", pos: { x: 380, y: 350 }, role: "Writer", model: "gpt-5.4-mini", icon: PencilSimple, providerColor: "#a3a3a3" },
  { id: "designer", pos: { x: 740, y: 350 }, role: "Designer", model: "gpt-5.4-mini", icon: PaintBrush, providerColor: "#a3a3a3" },
];

const EDGES: [string, string][] = [
  ["lead", "research"],
  ["lead", "strategy"],
  ["research", "analyst"],
  ["research", "writer"],
  ["strategy", "designer"],
];

const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

function bottomHandle(n: AgentSpec): Pos {
  return { x: n.pos.x + NODE_W / 2, y: n.pos.y + NODE_H };
}
function topHandle(n: AgentSpec): Pos {
  return { x: n.pos.x + NODE_W / 2, y: n.pos.y };
}

/** approximate getSmoothStepPath: orthogonal path with rounded corners */
function smoothStepPath(s: Pos, t: Pos, r = 12): string {
  if (s.x === t.x) return `M ${s.x} ${s.y} L ${t.x} ${t.y}`;
  const dir = t.x > s.x ? 1 : -1;
  const midY = (s.y + t.y) / 2;
  return [
    `M ${s.x} ${s.y}`,
    `L ${s.x} ${midY - r}`,
    `Q ${s.x} ${midY} ${s.x + dir * r} ${midY}`,
    `L ${t.x - dir * r} ${midY}`,
    `Q ${t.x} ${midY} ${t.x} ${midY + r}`,
    `L ${t.x} ${t.y}`,
  ].join(" ");
}

export function CanvasMock({ className }: { className?: string }) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.25)] " +
        (className ?? "")
      }
    >
      {/* Inner canvas — white bg with dot pattern (matches BackgroundVariant.Dots gap=18 size=1) */}
      <div
        className="relative w-full bg-white"
        style={{
          aspectRatio: `${VB_W} / ${VB_H}`,
          backgroundImage:
            "radial-gradient(circle, #e5e5e5 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          backgroundPosition: "0 0",
        }}
      >
        {/* SVG overlay for edges + handles */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="none"
        >
          {/* Edges */}
          {EDGES.map(([from, to]) => {
            const a = NODE_BY_ID[from];
            const b = NODE_BY_ID[to];
            if (!a || !b) return null;
            const s = bottomHandle(a);
            const t = topHandle(b);
            return (
              <path
                key={`${from}-${to}`}
                d={smoothStepPath(s, t, 12)}
                fill="none"
                stroke="#d4d4d4"
                strokeWidth="1.5"
              />
            );
          })}
          {/* Handle dots (8×8, neutral-400) — bottom of source + top of target */}
          {EDGES.flatMap(([from, to]) => {
            const a = NODE_BY_ID[from];
            const b = NODE_BY_ID[to];
            if (!a || !b) return [];
            const s = bottomHandle(a);
            const t = topHandle(b);
            return [
              <rect
                key={`${from}-${to}-s`}
                x={s.x - 4}
                y={s.y - 4}
                width={8}
                height={8}
                fill="#a3a3a3"
              />,
              <rect
                key={`${from}-${to}-t`}
                x={t.x - 4}
                y={t.y - 4}
                width={8}
                height={8}
                fill="#a3a3a3"
              />,
            ];
          })}
        </svg>

        {/* Nodes — positioned absolutely in % so they scale with the SVG */}
        {NODES.map((n) => (
          <div
            key={n.id}
            className="absolute"
            style={{
              left: `${(n.pos.x / VB_W) * 100}%`,
              top: `${(n.pos.y / VB_H) * 100}%`,
              width: `${(NODE_W / VB_W) * 100}%`,
              height: `${(NODE_H / VB_H) * 100}%`,
            }}
          >
            <AgentCard node={n} />
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentCard({ node }: { node: AgentSpec }) {
  const Icon = node.icon ?? User;
  return (
    <div className="flex h-full w-full items-center gap-2.5 rounded-md border border-neutral-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-100">
        <Icon className="h-4 w-4 text-neutral-600" weight="regular" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-semibold leading-tight text-neutral-900">
          {node.role}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] text-neutral-500">
          <span
            className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: node.providerColor ?? "#a3a3a3" }}
          />
          <span className="truncate font-mono">{node.model}</span>
        </div>
      </div>
    </div>
  );
}

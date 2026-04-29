import {
  DotsSixVertical,
  DotsThreeVertical,
} from "@phosphor-icons/react/dist/ssr";

const KPIS = [
  { label: "Pipeline Value", value: "124,100", unit: "USD" },
  { label: "Won (Quarter)", value: "35,800", unit: "USD" },
  { label: "Win Rate", value: "85", unit: "%" },
  { label: "Avg Deal Size", value: "6,345", unit: "USD" },
];

const PIPELINE: { stage: string; cards: string[] }[] = [
  {
    stage: "lead",
    cards: ["Nova", "Kinetic"],
  },
  {
    stage: "qualified",
    cards: ["Hanbit", "Polaris", "Nova"],
  },
  {
    stage: "proposal",
    cards: ["Acme", "BlueSky", "EduOne", "MetaRetail"],
  },
  {
    stage: "won",
    cards: ["GreenFood", "Acme", "BlueSky", "EduOne"],
  },
];

export function DashboardMock({ className }: { className?: string }) {
  return (
    <div
      className={
        "relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_30px_60px_-30px_rgba(0,0,0,0.25)] " +
        (className ?? "")
      }
    >
      <div className="space-y-3 bg-neutral-50 p-3 dark:bg-neutral-900/40">
        {/* Sales Overview */}
        <Panel title="Sales Overview">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {KPIS.map((k) => (
              <div
                key={k.label}
                className="rounded-md border border-neutral-200 bg-white p-4"
              >
                <div className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-neutral-400">
                  {k.label}
                </div>
                <div className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-neutral-900">
                  {k.value}
                </div>
                <div className="mt-2 text-[11px] text-neutral-500">
                  {k.unit}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Bottom row */}
        <div className="grid gap-3 lg:grid-cols-12">
          <Panel title="Revenue Trend" className="lg:col-span-5">
            <RevenueChart />
          </Panel>
          <Panel title="Sales Pipeline" className="lg:col-span-7">
            <PipelineKanban />
          </Panel>
        </div>
      </div>

    </div>
  );
}

function Panel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={
        "rounded-md border border-neutral-200 bg-white " + (className ?? "")
      }
    >
      <header className="flex items-center justify-between gap-2 border-b border-neutral-100 px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-neutral-700">
          <DotsSixVertical
            size={14}
            weight="bold"
            className="text-neutral-400"
          />
          <span className="text-[14px] font-medium tracking-tight">
            {title}
          </span>
        </div>
        <DotsThreeVertical
          size={14}
          weight="bold"
          className="text-neutral-400"
        />
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

function RevenueChart() {
  // Smooth curve mimicking the screenshot's revenue trend
  // Points roughly: low → up → small dip → flat low → spike up at end
  const points: [number, number][] = [
    [0, 30],
    [10, 22],
    [22, 18],
    [35, 32],
    [50, 48],
    [62, 58],
    [72, 62],
    [82, 38],
    [92, 12],
    [100, 6],
  ];
  const path = smoothPath(points);
  const yTicks = [0, 1500, 2000, 2500, 3000];
  const xTicks = ["2025-10", "2025-12", "2026-02", "2026-04"];

  return (
    <div>
      {/* Period toggle */}
      <div className="mb-2 flex items-center justify-end gap-3 font-mono text-[11px]">
        <span className="text-neutral-500">90d</span>
        <span className="rounded-md bg-neutral-900 px-2 py-0.5 text-white">
          180d
        </span>
        <span className="text-neutral-500">365d</span>
      </div>
      <div className="grid grid-cols-[34px_1fr] gap-x-1">
        {/* Y axis */}
        <div className="relative h-[160px] font-mono text-[10px] text-neutral-400">
          {[...yTicks].reverse().map((t, i) => (
            <div
              key={t}
              className="absolute right-0"
              style={{
                top: `${(i / (yTicks.length - 1)) * 100}%`,
                transform: "translateY(-50%)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
        {/* Plot */}
        <div className="relative h-[160px]">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {yTicks.map((_, i) => (
              <line
                key={i}
                x1="0"
                x2="100"
                y1={(i / (yTicks.length - 1)) * 100}
                y2={(i / (yTicks.length - 1)) * 100}
                stroke="#e5e5e5"
                strokeDasharray="0.6 0.8"
                strokeWidth="0.25"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <path
              d={path}
              fill="none"
              stroke="#171717"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
        {/* X axis */}
        <div />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-neutral-400">
          {xTicks.map((t) => (
            <span key={t} className="whitespace-nowrap">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function PipelineKanban() {
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {PIPELINE.map((col) => (
        <div key={col.stage} className="rounded-md bg-neutral-50/70 p-2">
          <div className="mb-2 flex items-center justify-between px-1 text-[12px]">
            <span className="font-medium lowercase tracking-tight text-neutral-700">
              {col.stage}
            </span>
            <span className="font-mono text-neutral-400">
              {col.cards.length}
            </span>
          </div>
          <div className="space-y-1.5">
            {col.cards.slice(0, 4).map((c) => (
              <div
                key={c}
                className="truncate rounded border border-neutral-200 bg-white px-2 py-1.5 text-[11.5px] text-neutral-700"
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* Catmull–Rom-ish smoothing into cubic bezier path through points */
function smoothPath(points: [number, number][]): string {
  if (points.length === 0) return "";
  const out: string[] = [];
  out.push(`M ${points[0][0]} ${points[0][1]}`);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const t = 0.18;
    const c1x = p1[0] + (p2[0] - p0[0]) * t;
    const c1y = p1[1] + (p2[1] - p0[1]) * t;
    const c2x = p2[0] - (p3[0] - p1[0]) * t;
    const c2y = p2[1] - (p3[1] - p1[1]) * t;
    out.push(
      `C ${c1x.toFixed(2)} ${c1y.toFixed(2)} ${c2x.toFixed(2)} ${c2y.toFixed(2)} ${p2[0]} ${p2[1]}`,
    );
  }
  return out.join(" ");
}

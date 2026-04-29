type Preset = {
  name: string;
  kind: string;
};

const PRESETS: Preset[] = [
  { name: "Slack", kind: "messaging" },
  { name: "Notion", kind: "docs" },
  { name: "HubSpot", kind: "crm" },
  { name: "Supabase", kind: "database" },
  { name: "Brave Search", kind: "search" },
  { name: "Tavily", kind: "search" },
];

export function McpGrid({ className }: { className?: string }) {
  return (
    <ul
      className={
        "grid grid-cols-2 gap-3 sm:grid-cols-3 " + (className ?? "")
      }
    >
      {PRESETS.map((p) => (
        <li
          key={p.name}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-lg transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-muted/40"
        >
          <div className="min-w-0">
            <div className="truncate text-[14px] font-medium tracking-tight text-foreground">
              {p.name}
            </div>
            <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {p.kind}
            </div>
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
            mcp
          </span>
        </li>
      ))}
      <li className="group flex items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-border-strong">
        <div className="min-w-0">
          <div className="truncate text-[14px] font-medium tracking-tight text-foreground">
            Bring your own
          </div>
          <div className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            any mcp server
          </div>
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
          custom
        </span>
      </li>
    </ul>
  );
}

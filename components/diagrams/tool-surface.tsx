export function ToolSurfaceDiagram() {
  return (
    <svg
      viewBox="0 0 800 360"
      className="w-full h-auto"
      role="img"
      aria-label="Tools from four sources exposed to the LLM through the same tool_use interface"
    >
      <defs>
        <marker
          id="ts-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="fill-muted-foreground" />
        </marker>
      </defs>

      {/* Sources (left column) */}
      <g>
        <text x="32" y="28" className="fill-muted-foreground font-mono" fontSize="10">
          sources
        </text>

        <rect x="32" y="40" width="200" height="56" rx="8" className="fill-card stroke-border" strokeWidth="1" />
        <text x="48" y="62" className="fill-foreground" fontSize="13" fontWeight="600">
          Built-in
        </text>
        <text x="48" y="82" className="fill-muted-foreground font-mono" fontSize="10">
          delegate_to · ask_user · activate_skill · search_history
        </text>

        <rect x="32" y="108" width="200" height="56" rx="8" className="fill-card stroke-border" strokeWidth="1" />
        <text x="48" y="130" className="fill-foreground" fontSize="13" fontWeight="600">
          Skills
        </text>
        <text x="48" y="150" className="fill-muted-foreground font-mono" fontSize="10">
          packages/skills/*/SKILL.md + Python
        </text>

        <rect x="32" y="176" width="200" height="56" rx="8" className="fill-card stroke-border" strokeWidth="1" />
        <text x="48" y="198" className="fill-foreground" fontSize="13" fontWeight="600">
          MCP servers
        </text>
        <text x="48" y="218" className="fill-muted-foreground font-mono" fontSize="10">
          mcp__server__tool · external proc
        </text>

        <rect x="32" y="244" width="200" height="56" rx="8" className="fill-card stroke-border" strokeWidth="1" />
        <text x="48" y="266" className="fill-foreground" fontSize="13" fontWeight="600">
          Subordinates
        </text>
        <text x="48" y="286" className="fill-muted-foreground font-mono" fontSize="10">
          delegate_to · delegate_parallel
        </text>
      </g>

      {/* Unifier */}
      <g>
        <rect x="300" y="120" width="180" height="100" rx="10" className="fill-muted stroke-accent" strokeWidth="1.5" />
        <text x="316" y="144" className="fill-accent font-mono" fontSize="10">
          tool registry
        </text>
        <text x="316" y="166" className="fill-foreground" fontSize="13" fontWeight="600">
          unify → JSON schema
        </text>
        <text x="316" y="188" className="fill-muted-foreground font-mono" fontSize="10">
          name · description
        </text>
        <text x="316" y="206" className="fill-muted-foreground font-mono" fontSize="10">
          input_schema (JSON Schema)
        </text>
      </g>

      {/* LLM view */}
      <g>
        <text x="548" y="28" className="fill-muted-foreground font-mono" fontSize="10">
          what the LLM sees
        </text>
        <rect x="548" y="40" width="220" height="280" rx="10" className="fill-card stroke-border" strokeWidth="1" />
        <text x="564" y="64" className="fill-foreground" fontSize="13" fontWeight="600">
          tools: [ ... ]
        </text>
        <line x1="564" y1="74" x2="752" y2="74" className="stroke-border" strokeWidth="1" />

        <text x="564" y="94" className="fill-muted-foreground font-mono" fontSize="10.5">{"{ name: \"search_history\","}</text>
        <text x="564" y="110" className="fill-muted-foreground font-mono" fontSize="10.5">{"  input_schema: {...} }"}</text>

        <text x="564" y="134" className="fill-muted-foreground font-mono" fontSize="10.5">{"{ name: \"activate_skill\","}</text>
        <text x="564" y="150" className="fill-muted-foreground font-mono" fontSize="10.5">{"  input_schema: {...} }"}</text>

        <text x="564" y="174" className="fill-muted-foreground font-mono" fontSize="10.5">{"{ name: \"mcp__github__pr\","}</text>
        <text x="564" y="190" className="fill-muted-foreground font-mono" fontSize="10.5">{"  input_schema: {...} }"}</text>

        <text x="564" y="214" className="fill-muted-foreground font-mono" fontSize="10.5">{"{ name: \"delegate_to\","}</text>
        <text x="564" y="230" className="fill-muted-foreground font-mono" fontSize="10.5">{"  input_schema: {...} }"}</text>

        <line x1="564" y1="248" x2="752" y2="248" className="stroke-border" strokeWidth="1" strokeDasharray="2 3" />
        <text x="564" y="270" className="fill-accent font-mono" fontSize="10">
          all the same shape
        </text>
        <text x="564" y="288" className="fill-muted-foreground font-mono" fontSize="10">
          → branching moves into the model
        </text>
        <text x="564" y="306" className="fill-muted-foreground font-mono" fontSize="10">
          → the engine is one dispatcher
        </text>
      </g>

      {/* Edges */}
      <line x1="232" y1="68" x2="300" y2="140" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#ts-arrow)" />
      <line x1="232" y1="136" x2="300" y2="158" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#ts-arrow)" />
      <line x1="232" y1="204" x2="300" y2="180" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#ts-arrow)" />
      <line x1="232" y1="272" x2="300" y2="200" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#ts-arrow)" />

      <line x1="480" y1="170" x2="548" y2="170" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#ts-arrow)" />
    </svg>
  );
}

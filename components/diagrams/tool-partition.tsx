export function ToolPartitionDiagram() {
  return (
    <svg
      viewBox="0 0 800 420"
      className="w-full h-auto"
      role="img"
      aria-label="A turn's tool_use blocks classified into the trajectory / parallel_trajectory / serial_write / safe_parallel four-class taxonomy"
    >
      <defs>
        <marker
          id="tp-arrow"
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

      {/* Input: assistant turn with N tool_use blocks */}
      <g>
        <text x="32" y="28" className="fill-muted-foreground font-mono" fontSize="10">
          assistant turn
        </text>
        <rect x="32" y="40" width="180" height="332" rx="10" className="fill-card stroke-border" strokeWidth="1" />
        <text x="48" y="64" className="fill-foreground" fontSize="13" fontWeight="600">
          tool_use[ ]
        </text>

        <rect x="48" y="80" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="95" className="fill-foreground font-mono" fontSize="10.5">delegate_to</text>

        <rect x="48" y="108" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="123" className="fill-foreground font-mono" fontSize="10.5">delegate_parallel</text>

        <rect x="48" y="136" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="151" className="fill-foreground font-mono" fontSize="10.5">ask_user</text>

        <rect x="48" y="164" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="179" className="fill-foreground font-mono" fontSize="10.5">activate_skill</text>

        <rect x="48" y="192" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="207" className="fill-foreground font-mono" fontSize="10.5">run_skill_script</text>

        <rect x="48" y="220" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="235" className="fill-foreground font-mono" fontSize="10.5">sql_query</text>

        <rect x="48" y="248" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="263" className="fill-foreground font-mono" fontSize="10.5">read_skill_file</text>

        <rect x="48" y="276" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="291" className="fill-foreground font-mono" fontSize="10.5">mcp__github__pr</text>

        <rect x="48" y="304" width="148" height="22" rx="4" className="fill-muted" />
        <text x="58" y="319" className="fill-foreground font-mono" fontSize="10.5">web-fetch</text>

        <rect x="48" y="332" width="148" height="16" rx="4" className="fill-muted" />
        <text x="58" y="344" className="fill-muted-foreground font-mono" fontSize="9.5">…N total</text>
      </g>

      {/* Partitioner */}
      <g>
        <rect x="270" y="170" width="120" height="80" rx="10" className="fill-muted stroke-accent" strokeWidth="1.5" />
        <text x="284" y="194" className="fill-accent font-mono" fontSize="10">
          tool-partition v2
        </text>
        <text x="284" y="216" className="fill-foreground" fontSize="13" fontWeight="600">
          classify
        </text>
        <text x="284" y="236" className="fill-muted-foreground font-mono" fontSize="9.5">
          name → class
        </text>
      </g>

      {/* Buckets — 4 classes */}
      <g>
        {/* trajectory (serial) */}
        <rect x="450" y="40" width="320" height="76" rx="10" className="fill-card stroke-border" strokeWidth="1" />
        <text x="466" y="64" className="fill-foreground" fontSize="13" fontWeight="600">
          trajectory · serial
        </text>
        <text x="466" y="84" className="fill-muted-foreground font-mono" fontSize="10">
          delegate_parallel · ask_user · activate_skill · todos
        </text>
        <text x="466" y="102" className="fill-muted-foreground font-mono" fontSize="10">
          → one at a time, order preserved
        </text>

        {/* parallel_trajectory */}
        <rect x="450" y="128" width="320" height="76" rx="10" className="fill-card stroke-border" strokeWidth="1" />
        <text x="466" y="152" className="fill-foreground" fontSize="13" fontWeight="600">
          parallel_trajectory
        </text>
        <text x="466" y="172" className="fill-muted-foreground font-mono" fontSize="10">
          delegate_to (cross-subordinate)
        </text>
        <text x="466" y="190" className="fill-muted-foreground font-mono" fontSize="10">
          → fan out up to PARALLEL_DELEGATION_MAX
        </text>

        {/* serial_write */}
        <rect x="450" y="216" width="320" height="76" rx="10" className="fill-card stroke-border" strokeWidth="1" />
        <text x="466" y="240" className="fill-foreground" fontSize="13" fontWeight="600">
          serial_write
        </text>
        <text x="466" y="260" className="fill-muted-foreground font-mono" fontSize="10">
          sql_exec · run_skill_script
        </text>
        <text x="466" y="278" className="fill-muted-foreground font-mono" fontSize="10">
          → serial, avoids intra-turn races
        </text>

        {/* safe_parallel */}
        <rect x="450" y="304" width="320" height="76" rx="10" className="fill-card stroke-border" strokeWidth="1" />
        <text x="466" y="328" className="fill-foreground" fontSize="13" fontWeight="600">
          safe_parallel
        </text>
        <text x="466" y="348" className="fill-muted-foreground font-mono" fontSize="10">
          sql_query · read_skill_file · web-fetch · mcp__*
        </text>
        <text x="466" y="366" className="fill-muted-foreground font-mono" fontSize="10">
          → run concurrently up to safe_parallel cap
        </text>
      </g>

      {/* Edges */}
      <line x1="212" y1="210" x2="270" y2="210" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#tp-arrow)" />
      <line x1="390" y1="190" x2="450" y2="78" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#tp-arrow)" />
      <line x1="390" y1="200" x2="450" y2="166" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#tp-arrow)" />
      <line x1="390" y1="220" x2="450" y2="254" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#tp-arrow)" />
      <line x1="390" y1="230" x2="450" y2="342" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#tp-arrow)" />
    </svg>
  );
}

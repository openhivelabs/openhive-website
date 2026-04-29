export function DelegationToolCallDiagram() {
  return (
    <svg
      viewBox="0 0 800 320"
      className="w-full h-auto"
      role="img"
      aria-label="When the LLM calls the delegate_to tool, the child agent executes"
    >
      <defs>
        <marker
          id="del-arrow"
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

      {/* Lead agent */}
      <g>
        <text x="32" y="28" className="fill-muted-foreground font-mono" fontSize="10">
          parent (lead)
        </text>
        <rect x="32" y="40" width="200" height="120" rx="10" className="fill-card stroke-border" strokeWidth="1" />
        <text x="48" y="64" className="fill-foreground" fontSize="13" fontWeight="600">
          Lead Agent
        </text>
        <text x="48" y="86" className="fill-muted-foreground font-mono" fontSize="10">
          turn loop
        </text>
        <rect x="48" y="100" width="168" height="22" rx="4" className="fill-muted" />
        <text x="58" y="115" className="fill-foreground font-mono" fontSize="10.5">
          delegate_to(&quot;writer&quot;, ...)
        </text>
        <rect x="48" y="128" width="168" height="22" rx="4" className="fill-muted" />
        <text x="58" y="143" className="fill-foreground font-mono" fontSize="10.5">
          delegate_parallel([...])
        </text>
      </g>

      {/* Engine */}
      <g>
        <rect x="300" y="60" width="200" height="200" rx="10" className="fill-muted stroke-accent" strokeWidth="1.5" />
        <text x="316" y="84" className="fill-accent font-mono" fontSize="10">
          engine · session.ts
        </text>
        <text x="316" y="106" className="fill-foreground" fontSize="13" fontWeight="600">
          Tool dispatcher
        </text>
        <line x1="316" y1="118" x2="484" y2="118" className="stroke-border" strokeWidth="1" />
        <text x="316" y="138" className="fill-muted-foreground font-mono" fontSize="10">
          1. validate assignee enum
        </text>
        <text x="316" y="156" className="fill-muted-foreground font-mono" fontSize="10">
          2. depth ≤ max_delegation_depth
        </text>
        <text x="316" y="174" className="fill-muted-foreground font-mono" fontSize="10">
          3. per-turn pair cap
        </text>
        <text x="316" y="192" className="fill-muted-foreground font-mono" fontSize="10">
          4. emit delegation_opened
        </text>
        <text x="316" y="210" className="fill-muted-foreground font-mono" fontSize="10">
          5. spawn child session
        </text>
        <text x="316" y="228" className="fill-muted-foreground font-mono" fontSize="10">
          6. inject result as tool_result
        </text>
        <text x="316" y="246" className="fill-muted-foreground font-mono" fontSize="10">
          7. delegation_closed
        </text>
      </g>

      {/* Children */}
      <g>
        <text x="568" y="28" className="fill-muted-foreground font-mono" fontSize="10">
          children (fresh ctx)
        </text>
        <rect x="568" y="40" width="200" height="60" rx="8" className="fill-card stroke-border" strokeWidth="1" />
        <text x="584" y="62" className="fill-foreground" fontSize="13" fontWeight="600">
          writer
        </text>
        <text x="584" y="82" className="fill-muted-foreground font-mono" fontSize="10">
          isolated history · own model
        </text>

        <rect x="568" y="112" width="200" height="60" rx="8" className="fill-card stroke-border" strokeWidth="1" />
        <text x="584" y="134" className="fill-foreground" fontSize="13" fontWeight="600">
          researcher
        </text>
        <text x="584" y="154" className="fill-muted-foreground font-mono" fontSize="10">
          parallel · forked cache
        </text>

        <rect x="568" y="184" width="200" height="60" rx="8" className="fill-card stroke-border" strokeWidth="1" />
        <text x="584" y="206" className="fill-foreground" fontSize="13" fontWeight="600">
          verifier
        </text>
        <text x="584" y="226" className="fill-muted-foreground font-mono" fontSize="10">
          mode: verify · read-only
        </text>
      </g>

      {/* Edges */}
      <line x1="232" y1="111" x2="300" y2="140" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#del-arrow)" />
      <line x1="232" y1="139" x2="300" y2="180" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#del-arrow)" />

      <line x1="500" y1="130" x2="568" y2="68" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#del-arrow)" />
      <line x1="500" y1="160" x2="568" y2="140" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#del-arrow)" />
      <line x1="500" y1="190" x2="568" y2="212" className="stroke-muted-foreground" strokeWidth="1" markerEnd="url(#del-arrow)" />

      {/* Return path (dashed) */}
      <path
        d="M 668 244 Q 668 290 400 290 Q 132 290 132 165"
        className="stroke-muted-foreground"
        strokeWidth="1"
        strokeDasharray="3 3"
        fill="none"
        markerEnd="url(#del-arrow)"
      />
      <text x="320" y="285" className="fill-muted-foreground font-mono" fontSize="9.5">
        result re-injected into parent history as tool_result
      </text>
    </svg>
  );
}

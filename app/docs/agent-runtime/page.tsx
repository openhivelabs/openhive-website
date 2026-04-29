import Link from "next/link";
import { DelegationToolCallDiagram } from "@/components/diagrams/delegation-tool-call";
import { ToolPartitionDiagram } from "@/components/diagrams/tool-partition";

export default function AgentRuntimePage() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Engineering · Agent runtime
      </p>
      <h1 className="font-display mt-3 text-[48px] leading-[1.05] tracking-[-0.02em]">
        Agent runtime &amp; delegation
      </h1>
      <p className="mt-6 text-[18px] leading-[1.65] text-muted-foreground">
        OpenHive&apos;s agents do not run on top of a static graph. The org
        chart you draw on the canvas only constrains who is allowed to call
        whom; actual delegation happens because the LLM emits a{" "}
        <Code>delegate_to(...)</Code> <em>tool</em> call every turn. Most of
        the runtime&apos;s shape — dynamic delegation, child context
        isolation, parallel-fork cache reuse, tool partitioning — falls out of
        that single decision.
      </p>

      <H2>Why a tool call instead of a graph</H2>
      <P>
        The most natural alternative is the LangGraph-style approach: compile
        the org chart so an edge like <Code>lead → writer</Code> is baked in
        at build time. OpenHive deliberately rejects that.{" "}
        <Strong>Delegation is a per-turn judgement the LLM makes</Strong>, not
        information you can know ahead of time. For the same input one turn
        delegates and another answers directly. One turn fans out to three
        subordinates in parallel; another sends to just one.
      </P>
      <P>
        So <Code>delegate_to</Code> and <Code>delegate_parallel</Code> are
        exposed at the same level as every other tool. The org chart only
        enters as the enum of valid <Code>assignee</Code> parameters — the
        canvas guarantees only direct children pass through. How that unified
        tool surface is assembled from different sources is covered in{" "}
        <Link
          href="/docs/tools"
          className="underline decoration-rule decoration-1 underline-offset-4 hover:text-foreground"
        >
          The tools an AI uses
        </Link>
        .
      </P>

      <Figure caption="The LLM emits delegate_to → the engine validates, records events, spawns the child session, and re-injects the result into the parent's history.">
        <DelegationToolCallDiagram />
      </Figure>

      <H2>What happens in a single delegation</H2>
      <P>
        When the parent agent&apos;s LLM produces a <Code>tool_use</Code>{" "}
        block of <Code>delegate_to(&quot;writer&quot;, prompt, mode)</Code>,
        the engine processes it in this order.
      </P>
      <ol className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Numbered n={1}>
          <Strong>Schema validation.</Strong> <Code>assignee</Code> must be in
          the enum of the parent node&apos;s direct children on the canvas.
          That is the only constraint the org chart enforces.
        </Numbered>
        <Numbered n={2}>
          <Strong>Depth and pair-cap checks.</Strong>{" "}
          <Code>max_delegation_depth</Code> and the per-turn{" "}
          <Code>max_delegations_per_pair_per_turn</Code> stop runaway loops.
          They prevent the model from calling the same child over and over in
          one turn.
        </Numbered>
        <Numbered n={3}>
          <Strong>delegation_opened event.</Strong> A line is appended to{" "}
          <Code>events.jsonl</Code> and the corresponding node on the Run
          canvas immediately switches to active state. The UI does not watch a
          separate channel.
        </Numbered>
        <Numbered n={4}>
          <Strong>Child session spawn.</Strong> The child starts with a{" "}
          <em>fresh, isolated</em> history. It does not inherit the
          parent&apos;s conversation — only the prompt the parent explicitly
          passed in plus the child&apos;s AGENT.md system prompt. Context-leak
          prevention first; cache efficiency second.
        </Numbered>
        <Numbered n={5}>
          <Strong>Child turn loop runs.</Strong> The child runs with its own
          model and its own toolset. It may delegate further — recursion
          starts here.
        </Numbered>
        <Numbered n={6}>
          <Strong>Result injection.</Strong> When the child finishes, its
          output is appended to the parent&apos;s history as a{" "}
          <Code>tool_result</Code> block. From the parent model&apos;s
          perspective an ordinary tool call has just returned.
        </Numbered>
        <Numbered n={7}>
          <Strong>delegation_closed event.</Strong> A close event is recorded
          along with success/failure status and the corresponding edge on the
          Run canvas deactivates.
        </Numbered>
      </ol>

      <H2>Why the child&apos;s context is empty</H2>
      <P>
        Not handing the parent&apos;s full message history to the child is
        intentional. Three effects follow.
      </P>
      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Strong>Token cost separation.</Strong> The parent&apos;s
          accumulated context is paid for only by the parent. A model where
          each child carries the parent&apos;s entire history grows
          exponentially expensive as delegation deepens.
        </Bullet>
        <Bullet>
          <Strong>Role isolation.</Strong> The writer doesn&apos;t need to
          know which user the lead was talking to. Only the prompt the parent
          consciously crafted defines the child&apos;s task.
        </Bullet>
        <Bullet>
          <Strong>Cache friendliness.</Strong> The child&apos;s prefix (system
          prompt + AGENT.md + tool definitions) is identical across calls.
          Calling the same child again means a prefix cache hit.
        </Bullet>
      </ul>

      <H2>Parallel delegation and fork cache reuse</H2>
      <P>
        With{" "}
        <Code>delegate_parallel([writer, researcher, verifier])</Code>{" "}
        sending several children in one turn, each child session shares the
        same parent snapshot at the same instant. For Claude providers the
        engine exploits this: the same prompt prefix is{" "}
        <em>cache-written once</em> and the sibling children fork on top of
        that cache. As a result, fanning out work across N siblings keeps
        prompt-cache cost close to 1×.
      </P>
      <P>
        Other providers (Codex, Copilot, etc.) have different prefix-cache
        semantics, so <Code>fork.ts</Code> falls into the{" "}
        <Code>non_claude</Code> branch and only context isolation applies.
      </P>

      <H2>Many tools in a single turn — how they&apos;re executed</H2>
      <P>
        The model can emit several <Code>tool_use</Code> blocks in one
        assistant turn. Running them all serially is safe but slow; running
        them all in parallel makes side effects collide. OpenHive uses a
        classifier called <Strong>tool partition v2</Strong> to put each call
        into one of four classes, then applies a different concurrency policy
        per class.
      </P>

      <Figure caption="Tool name → class. trajectory and serial_write run serially; parallel_trajectory and safe_parallel run up to a per-class cap.">
        <ToolPartitionDiagram />
      </Figure>

      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Strong>trajectory (serial).</Strong> <Code>delegate_parallel</Code>
          , <Code>ask_user</Code>, <Code>activate_skill</Code>,{" "}
          <Code>set_todos</Code> / <Code>add_todo</Code> /{" "}
          <Code>complete_todo</Code>. These mutate run-scoped state (todos,
          ask_user inbox, the active skill set) that the next tool in the same
          batch may read, so they cannot overlap. One at a time, in order.
        </Bullet>
        <Bullet>
          <Strong>parallel_trajectory (cross-subordinate parallel).</Strong>{" "}
          The dedicated class for <Code>delegate_to</Code>. When children
          differ, their pair counters, scratch directories, and ledger rows
          are disjoint, so simultaneous execution is safe. Because each branch
          spawns an LLM stream, the cap is{" "}
          <Code>OPENHIVE_PARALLEL_DELEGATION_MAX</Code> — separate from the
          safe_parallel cap.
        </Bullet>
        <Bullet>
          <Strong>serial_write (serial).</Strong> <Code>sql_exec</Code>,{" "}
          <Code>run_skill_script</Code>. Arbitrary Python and team-DB writes
          are serialised to avoid intra-turn races.
        </Bullet>
        <Bullet>
          <Strong>safe_parallel (parallel).</Strong> <Code>sql_query</Code>,{" "}
          <Code>read_skill_file</Code>, the <Code>web-fetch</Code> /{" "}
          <Code>web-search</Code> skills, and every <Code>mcp__*</Code> tool.
          Side-effect-free or idempotent, so the engine fires up to the
          class&apos;s cap in one go; oversize buckets split into consecutive
          parallel runs of cap-size each.
        </Bullet>
      </ul>
      <P>
        When <Code>delegate_to(writer)</Code> and{" "}
        <Code>delegate_to(researcher)</Code> appear side by side in one turn,
        both fire in parallel within the same class (parallel_trajectory).
        That is exactly what motivated v2 — the v1 rule of &quot;trajectory
        is always serial&quot; was needlessly costly when different children
        share no state.
      </P>

      <H2>Agent persona: AGENT.md</H2>
      <P>
        Each node&apos;s identity lives in a single file at{" "}
        <Code>packages/agents/{"{name}"}/AGENT.md</Code>. The runtime reads
        it and splices the body into the system prompt. The result looks
        roughly like this.
      </P>
      <pre className="mt-6 overflow-x-auto rounded-lg bg-card p-6 font-mono text-[12.5px] leading-[1.7] text-foreground shadow-[inset_0_0_0_1px_var(--rule)]">{`<system>
[Engine-wide rules — tool-use protocol, delegation guidance, output format]

[AGENT.md body — this node's role, tone, prohibitions, descriptions of its delegates]

[Current team state — direct children, which modes can be called]

[Active skills — bodies of any SKILL.md activated via activate_skill]
</system>`}</pre>
      <P>
        Editing AGENT.md <em>is</em> agent tuning. You&apos;re not toggling a
        config knob; you&apos;re rewriting in markdown what kind of person
        this node is.
      </P>

      <H2>Safety caps, in one place</H2>
      <P>
        Dynamic delegation is powerful but prone to runaway. The caps the
        engine enforces are:
      </P>
      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Code>max_delegation_depth</Code> — depth of the delegation tree.
          Stops the child-of-a-child-of-a-child... chain from going infinite.
        </Bullet>
        <Bullet>
          <Code>max_delegations_per_pair_per_turn</Code> — how many times the
          same (parent → child) pair can be invoked within a single turn.
        </Bullet>
        <Bullet>
          <Code>per-assignee max_parallel</Code> — caps how many concurrent
          delegations can target the same child. If{" "}
          <Code>delegate_parallel</Code> emits N&gt;cap calls to one assignee,
          only cap of them go through.
        </Bullet>
        <Bullet>
          <Code>delegationSatisfied</Code> flag — once a child&apos;s result
          has come back to the parent, the same pair is blocked from being
          re-delegated within the same turn. This stops the model from
          calling again before it has even read the result.
        </Bullet>
      </ul>

      <H2>Related code</H2>
      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Code>apps/web/lib/server/engine/session.ts</Code> — turn loop,
          delegation tool dispatch, cap enforcement
        </Bullet>
        <Bullet>
          <Code>apps/web/lib/server/engine/fork.ts</Code> — prefix-cache fork
          for parallel delegation
        </Bullet>
        <Bullet>
          <Code>apps/web/lib/server/engine/tool-partition.ts</Code> — tool →
          class classifier
        </Bullet>
        <Bullet>
          <Code>apps/web/lib/server/agents/runtime.ts</Code>,{" "}
          <Code>packages/agents/*/AGENT.md</Code> — agent persona loading
        </Bullet>
      </ul>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display mt-16 text-[28px] leading-[1.2] tracking-[-0.015em]">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-[16px] leading-[1.75] text-muted-foreground">
      {children}
    </p>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em] text-foreground">
      {children}
    </code>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3.5">
      <span className="mt-3 inline-block h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
      <span>{children}</span>
    </li>
  );
}

function Numbered({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex gap-3.5">
      <span className="mt-0.5 inline-block min-w-[1.5rem] font-mono text-[13px] text-muted-foreground">
        {String(n).padStart(2, "0")}
      </span>
      <span>{children}</span>
    </li>
  );
}

function Figure({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <figure className="mt-10">
      <div className="rounded-xl bg-background-alt p-6 sm:p-8 shadow-[inset_0_0_0_1px_var(--rule)]">
        {children}
      </div>
      <figcaption className="mt-4 text-center font-display italic text-[14px] text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

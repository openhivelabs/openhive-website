import type { Metadata } from "next";
import Link from "next/link";
import { ToolSurfaceDiagram } from "@/components/diagrams/tool-surface";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "The OpenHive tool surface — how agents access the world, how tools are scoped to roles, and how to extend them.",
  alternates: { canonical: "/docs/tools" },
  openGraph: {
    title: "Tools — OpenHive",
    description:
      "The OpenHive tool surface: how agents access the world and how to extend it.",
    url: "/docs/tools",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tools — OpenHive",
    description:
      "The OpenHive tool surface: how agents access the world and how to extend it.",
  },
};

export default function ToolsPage() {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Engineering · Tools
      </p>
      <h1 className="font-display mt-3 text-[48px] leading-[1.05] tracking-[-0.02em]">
        The tools an AI uses
      </h1>
      <p className="mt-6 text-[18px] leading-[1.65] text-muted-foreground">
        In OpenHive, the LLM only ever interacts with the outside world in
        one way — <Code>tool_use</Code>. Reading a file, calling an external
        API, even getting a person to do something — they all look like the
        same kind of decision to the model. This piece is about the
        &quot;tool surface&quot; the model sees, and who fills it in from
        where.
      </p>

      <H2>The unifying principle: every capability is a tool</H2>
      <P>
        Instead of branching by type at the engine level, OpenHive exposes
        every agent capability through a single interface: a named function
        with a JSON Schema. What the model sees in the prompt is just{" "}
        <Code>{"tools: [{ name, description, input_schema }, ...]"}</Code> —
        and what kind of capability each entry came from doesn&apos;t matter
        to the model.
      </P>
      <P>
        As a consequence, <Strong>routing decisions live inside the model</Strong>.
        The engine has no &quot;if this kind of request, call a skill;
        otherwise delegate&quot; branching. Its job is the dispatch loop:
        forward a <Code>tool_use</Code> block to the right executor and feed
        the result back as <Code>tool_result</Code>.
      </P>

      <Figure caption="Tools from four sources are exposed to the LLM through a single registry, each in the same JSON-Schema shape.">
        <ToolSurfaceDiagram />
      </Figure>

      <H2>Four kinds of tool</H2>
      <P>
        Tools split into four kinds by where they come from. The model
        doesn&apos;t see the difference, but the engine has to — execution
        model, concurrency, latency, and cost are all different.
      </P>

      <H3>1. Built-in tools</H3>
      <P>
        Functions wired directly into the engine code. Delegation
        (<Code>delegate_to</Code>, <Code>delegate_parallel</Code>), user
        questions (<Code>ask_user</Code>), skill activation and execution
        (<Code>activate_skill</Code>, <Code>list_skill_files</Code>,{" "}
        <Code>read_skill_file</Code>, <Code>run_skill_script</Code>), todo
        manipulation (<Code>set_todos</Code>, <Code>add_todo</Code>,{" "}
        <Code>complete_todo</Code>), history search
        (<Code>search_history</Code>, <Code>read_history_entry</Code>), team
        DB (<Code>db_query</Code>, <Code>db_exec</Code>,{" "}
        <Code>db_describe</Code>, etc.). Fast and deterministic — the
        downside is that adding a new capability means changing the engine.
        That&apos;s why file I/O, web fetch, and domain-specific transforms
        live in <em>skills</em> instead.
      </P>

      <H3>2. Skills</H3>
      <P>
        A bundle of <Code>SKILL.md</Code> + optional Python scripts under{" "}
        <Code>packages/skills/{"{name}"}/</Code>. The markdown body is the
        skill&apos;s &quot;manual,&quot; and the model has to{" "}
        <em>activate</em> the skill before it can call any of its functions.
        It&apos;s a two-stage progressive disclosure.
      </P>
      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Strong>Stage 1 — discovery.</Strong> The system prompt lists each
          skill by short name and a one-line description only. The body is
          not loaded.
        </Bullet>
        <Bullet>
          <Strong>Stage 2 — activation.</Strong> When the model calls{" "}
          <Code>activate_skill(&quot;name&quot;)</Code>, that skill&apos;s
          SKILL.md body is injected into the system prompt and its Python
          function signatures are appended to the tool array.
        </Bullet>
        <Bullet>
          <Strong>Stage 3 — invocation.</Strong> The Python function is
          executed in a per-call subprocess gated by{" "}
          <Code>OPENHIVE_PYTHON_CONCURRENCY</Code>. Queue states
          (<Code>skill.queued</Code>, <Code>skill.started</Code>) are
          streamed to the UI.
        </Bullet>
      </ul>
      <P>
        The point of this structure is that{" "}
        <Strong>long manuals can sit around for free, in token terms</Strong>
        . With 100 skills, the system prompt only carries 100 one-line
        entries; each body lands in the context only when the model commits
        to using it.
      </P>

      <H3>3. MCP tools (Model Context Protocol)</H3>
      <P>
        Tools that run as external processes. GitHub, Slack, Linear, an
        internal database — wrap any system in an MCP server and it
        registers automatically into the OpenHive tool surface. The exposed
        names follow the convention <Code>mcp__{"{server}"}__{"{tool}"}</Code>
        so they live in their own namespace.
      </P>
      <P>
        The MCP manager is <em>lazy</em>. The server process is not spawned
        until the first call, and once up, it&apos;s reused for the rest of
        the session. Because it&apos;s a separate process, the trust
        boundary is also separate — permissions, timeouts, and input
        validation are the MCP server&apos;s own responsibility.
      </P>

      <H3>4. Subordinates as tools</H3>
      <P>
        The tool array also contains <Code>delegate_to</Code> /{" "}
        <Code>delegate_parallel</Code>; the <Code>assignee</Code> parameter
        is the enum of direct children fixed by the canvas. The result of
        such a call is not a plain function return — the child&apos;s turn
        loop runs end-to-end and the synthesised <Code>tool_result</Code>
        comes back. To the parent model, it just looks like an ordinary tool
        call has finished. Lifecycle, caps, and child context isolation are
        covered in{" "}
        <Link
          href="/docs/agent-runtime"
          className="underline decoration-rule decoration-1 underline-offset-4 hover:text-foreground"
        >
          Agent runtime &amp; delegation
        </Link>
        .
      </P>

      <H2>Why expose them all in the same shape</H2>
      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Strong>Branching moves into the model.</Strong> Whether to read a
          file or ask a person is a domain judgement. It belongs in the
          model&apos;s reasoning, not in an engine if/else.
        </Bullet>
        <Bullet>
          <Strong>The engine stays small.</Strong> One dispatcher routes by
          name, so adding a new kind of tool doesn&apos;t change the turn
          loop.
        </Bullet>
        <Bullet>
          <Strong>The UI becomes uniform.</Strong> A node on the Run canvas
          receives the same events (<Code>tool_call</Code>,{" "}
          <Code>tool_result</Code>) regardless of what kind of tool was
          called.
        </Bullet>
        <Bullet>
          <Strong>You inherit the model&apos;s training.</Strong> Every
          major LLM is already well-trained on the tool-call format. A
          unified surface gets that training benefit for free.
        </Bullet>
      </ul>

      <H2>Trade-offs across the four kinds</H2>
      <div className="mt-8 overflow-x-auto rounded-lg shadow-[inset_0_0_0_1px_var(--rule)]">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="bg-card">
              <Th>Kind</Th>
              <Th>Latency</Th>
              <Th>Extensibility</Th>
              <Th>Cost profile</Th>
              <Th>Best fit</Th>
            </tr>
          </thead>
          <tbody>
            <Tr>
              <Td>Built-in</Td>
              <Td>Lowest</Td>
              <Td>None (engine change)</Td>
              <Td>Effectively free</Td>
              <Td>FS · search · core comms</Td>
            </Tr>
            <Tr>
              <Td>Skill</Td>
              <Td>Cold start</Td>
              <Td>High (drop-in dir)</Td>
              <Td>Python concurrency gate</Td>
              <Td>Domain logic · deterministic transforms</Td>
            </Tr>
            <Tr>
              <Td>MCP</Td>
              <Td>Network / IPC</Td>
              <Td>Very high</Td>
              <Td>External system quotas</Td>
              <Td>External SaaS · internal DB integrations</Td>
            </Tr>
            <Tr>
              <Td>Delegation</Td>
              <Td>Highest</Td>
              <Td>Bounded by org chart</Td>
              <Td>Per-turn tokens</Td>
              <Td>Judgement · creative · multi-step work</Td>
            </Tr>
          </tbody>
        </table>
      </div>

      <H2>When to reach for which</H2>
      <P>
        There&apos;s no strict decision rule — the same job can often be
        solved by all three. As a rough heuristic:
      </P>
      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Strong>Can it be solved with code?</Strong> → Skill.
          Deterministic, no token cost.
        </Bullet>
        <Bullet>
          <Strong>Is there an existing external system?</Strong> → MCP. Reuse
          its auth and permissions directly.
        </Bullet>
        <Bullet>
          <Strong>Does it need judgement or creativity?</Strong> →
          Delegation. Let a different persona&apos;s LLM run with isolated
          context and bring back only the result.
        </Bullet>
        <Bullet>
          <Strong>FS / search / basic comms?</Strong> → Built-in. Don&apos;t
          reinvent it.
        </Bullet>
      </ul>

      <H2>How tools end up in the system prompt</H2>
      <P>
        Right before an agent starts a turn, the engine assembles the tool
        array in this order.
      </P>
      <pre className="mt-6 overflow-x-auto rounded-lg bg-card p-6 font-mono text-[12.5px] leading-[1.7] text-foreground shadow-[inset_0_0_0_1px_var(--rule)]">{`tools = [
  ...builtin_tools,                       // always included
  ...active_skill_tools,                  // only skills opened by activate_skill
  ...mcp_tools,                           // whatever the MCP manager registered
  delegate_to({ assignee: enum(children) }), // only when there are direct children
  delegate_parallel(...),                 // ditto
]`}</pre>
      <P>
        The result is a flat array. The model receives it and — without
        knowing where each entry came from — picks its next action.
      </P>

      <H2>Related code</H2>
      <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.7] text-muted-foreground">
        <Bullet>
          <Code>apps/web/lib/server/agents/skill-bundles.ts</Code> — skill
          activation and system-prompt injection
        </Bullet>
        <Bullet>
          <Code>apps/web/lib/server/skills/runner.ts</Code>,{" "}
          <Code>concurrency.ts</Code> — Python subprocess execution and the
          concurrency gate
        </Bullet>
        <Bullet>
          <Code>apps/web/lib/server/mcp/manager.ts</Code> — MCP server lazy
          start and tool registration
        </Bullet>
        <Bullet>
          <Code>apps/web/lib/server/engine/session.ts</Code> — tool-array
          assembly and the dispatch loop
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

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-display mt-10 text-[20px] leading-[1.25] tracking-[-0.01em]">
      {children}
    </h3>
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

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-rule px-4 py-3 text-left font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-muted-foreground">
      {children}
    </th>
  );
}

function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-rule last:border-b-0">{children}</tr>;
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="px-4 py-3 align-top text-foreground">{children}</td>
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

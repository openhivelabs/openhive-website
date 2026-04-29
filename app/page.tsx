import Link from "next/link";
import {
  ArrowRight,
  GithubLogo,
  Database,
  TreeStructure,
  PlugsConnected,
} from "@phosphor-icons/react/dist/ssr";
import { CanvasMock } from "@/components/canvas-mock";
import { DashboardMock } from "@/components/dashboard-mock";
import { McpGrid } from "@/components/mcp-grid";
import { InstallTerminal } from "@/components/install-terminal";
import { HeroBoard } from "@/components/hero-board";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Atmospheric gradient backdrop — dark mode only */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, color-mix(in oklab, var(--accent) 22%, transparent) 0%, transparent 60%), radial-gradient(40% 50% at 80% 30%, color-mix(in oklab, var(--accent-2) 18%, transparent) 0%, transparent 70%)",
          }}
        />
        {/* Honeycomb pattern — both modes */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[760px] [mask-image:radial-gradient(70%_55%_at_50%_0%,black_30%,transparent_85%)]"
        >
          <svg className="h-full w-full text-stone-900/[0.045] dark:text-white/[0.05]" aria-hidden>
            <defs>
              <pattern
                id="hero-hex"
                width="56"
                height="49"
                patternUnits="userSpaceOnUse"
                patternTransform="translate(0 0)"
              >
                <path
                  d="M14 0 L42 0 L56 24.5 L42 49 L14 49 L0 24.5 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-hex)" />
          </svg>
        </div>

        <div className="relative z-10 flex min-h-[calc(100vh-90px)] flex-col gap-20 pb-16 pt-16 md:gap-24 md:pb-20 md:pt-20">
          {/* Hero illustration — full-bleed across the viewport */}
          <div
            aria-hidden
            className="relative h-[32vh] min-h-[230px] w-full"
          >
            <HeroBoard />
          </div>

          <div className="mx-auto mt-3 max-w-5xl px-6 text-center md:mt-5">
            <h1 className="mb-5 text-balance text-5xl font-medium leading-[1.02] tracking-[-0.04em] text-stone-900 md:text-6xl lg:text-7xl dark:text-stone-100">
              OpenHive
            </h1>

            <p className="mx-auto mb-9 max-w-xl text-pretty text-base leading-[1.55] text-muted-foreground md:text-lg">
              Compose an AI team that fits how you work.
              <br className="hidden md:block" />
              It never sleeps. Scale it as wide as you want.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/docs"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-7 text-[15px] font-medium text-background transition-transform hover:scale-[1.02]"
              >
                Read the docs
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                />
              </Link>
              <a
                href="https://github.com/openhivelabs/openhive"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-7 text-[15px] font-medium text-foreground backdrop-blur transition-colors hover:bg-muted"
              >
                <GithubLogo size={16} />
                Source on GitHub
              </a>
            </div>
          </div>

          {/* Quickstart sits below the hero, both centered in the viewport */}
          <div className="mx-auto grid w-full max-w-5xl items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
            <div className="text-left">
              <h2 className="text-balance text-2xl font-semibold leading-[1.1] tracking-tight md:text-3xl">
                Setup
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-muted-foreground">
                First launch walks you through connecting a model provider
                (OAuth or API key, required), MCP tools, and your first agent
                team. No cloud, no signup — runs on your machine.
              </p>
            </div>
            <div>
              <InstallTerminal />
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS ─────────────────────────────────────────── */}
      <section className="relative bg-background">
        <div className="container mx-auto px-6 py-20 md:py-28">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-5 text-balance text-4xl font-bold tracking-tight md:text-5xl">
              Everything you need, in one local app.
            </h2>
            <p className="text-pretty text-lg text-muted-foreground">
              From the data layer to the team layer to the world outside —
              OpenHive ships the whole stack as a single binary.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Pillar
              icon={TreeStructure}
              num="01"
              title="Design an agent company"
              body="Sketch a hierarchy of agents on a canvas. Pick a model per node. The Lead delegates by tool call — your org chart is the program."
            />
            <Pillar
              icon={Database}
              num="02"
              title="Build a dashboard"
              body="Drag blocks onto a grid. Bind them to your local SQLite or to an external data source. Agents read and write the same store."
            />
            <Pillar
              icon={PlugsConnected}
              num="03"
              title="Plug into your stack"
              body="Give agents tools through MCP — Slack, Notion, HubSpot, Supabase, your internal services. Bring any server you run."
            />
          </div>
        </div>
      </section>

      {/* 01 — AGENT COMPANY ────────────────────────────────────── */}
      <FeatureSection
        eyebrow="01 — Agent Company"
        title="Design a company of agents."
        body="Drop agents on a canvas, wire reporting lines, and pick a model per node. The Lead delegates by calling a tool at runtime, choosing assignees from the chart you drew — no DSL, no YAML, no compiled graph. Or skip the blank canvas and pull a ready-made company, team, agent, or panel from the Frame Market."
        reverse={false}
      >
        <CanvasMock />
      </FeatureSection>

      {/* 02 — DASHBOARDS ───────────────────────────────────────── */}
      <FeatureSection
        eyebrow="02 — Dashboards"
        title="Build a dashboard over your data."
        body="Pull the panels you need from the Frame Market and arrange them in any shape and position you want. Fill them with the data you want — ask AI to build a company database inside the app, or connect an external API to stream data in real time."
        reverse
      >
        <DashboardMock />
      </FeatureSection>

      {/* 03 — MCP INTEGRATIONS ─────────────────────────────────── */}
      <FeatureSection
        eyebrow="03 — Integrations"
        title="Plug it into the software you already use."
        body="OpenHive speaks MCP, the open protocol for tool servers. Pick a preset like Slack, Notion, or Supabase, or attach any MCP server you run yourself — each agent only gets the tools it actually needs."
        reverse={false}
      >
        <McpGrid />
      </FeatureSection>

      {/* CTA ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 100%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 60%), radial-gradient(40% 60% at 50% 100%, color-mix(in oklab, var(--accent-2) 14%, transparent), transparent 70%)",
          }}
        />
        <div className="container mx-auto px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-8 flex justify-center">
              <span className="inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Get started
              </span>
            </div>
            <div className="mx-auto max-w-md">
              <InstallTerminal />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── helpers ─────────────────────────────────────────────────── */

function Pillar({
  icon: Icon,
  num,
  title,
  body,
}: {
  icon: React.ComponentType<{ size?: number; weight?: "regular" | "fill" | "bold" }>;
  num: string;
  title: string;
  body: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl p-7 transition-all hover:bg-muted/40">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--accent) 40%, transparent), transparent 70%)",
        }}
      />
      <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
        <Icon size={22} weight="bold" />
      </div>
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {num}
      </div>
      <div className="mb-3 text-xl font-semibold tracking-tight text-foreground">
        {title}
      </div>
      <p className="text-[14.5px] leading-[1.65] text-muted-foreground">
        {body}
      </p>
    </div>
  );
}

function FeatureSection({
  eyebrow,
  title,
  body,
  bullets,
  reverse,
  tinted,
  children,
}: {
  eyebrow: string;
  title: string;
  body: string;
  bullets?: string[];
  reverse: boolean;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={
        "relative " + (tinted ? "bg-background-alt" : "bg-background")
      }
    >
      <div className="container mx-auto px-6 py-20 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div
            className={
              "lg:col-span-5 " + (reverse ? "lg:order-2" : "lg:order-1")
            }
          >
            <p className="mb-4 bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-2)] bg-clip-text text-xs font-semibold uppercase tracking-[0.18em] text-transparent">
              {eyebrow}
            </p>
            <h2 className="mb-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
              {title}
            </h2>
            <p className="mb-8 text-[16.5px] leading-[1.7] text-muted-foreground">
              {body}
            </p>
            {bullets && bullets.length > 0 && (
              <ul className="space-y-3">
                {bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-3 text-[14.5px] text-foreground/85"
                  >
                    <span className="mt-[7px] inline-block h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-2)]" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div
            className={
              "lg:col-span-7 " + (reverse ? "lg:order-1" : "lg:order-2")
            }
          >
            <div className="relative">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-6 -z-10 hidden rounded-[32px] opacity-60 dark:block"
                style={{
                  background:
                    "radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--accent) 12%, transparent), transparent 70%)",
                }}
              />
              {children}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

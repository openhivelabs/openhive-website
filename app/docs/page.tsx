import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

export default function DocsIndex() {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        Documentation
      </p>
      <h1 className="font-display mt-3 text-[44px] leading-[1.05] tracking-[-0.02em]">
        Engineering notes
      </h1>
      <p className="mt-6 max-w-2xl text-[17px] leading-[1.7] text-muted-foreground">
        How OpenHive is built, why it&apos;s shaped the way it is, and what the
        trade-offs were. These pages are for engineers who want to look under
        the hood — or contribute.
      </p>

      <div className="mt-14 space-y-px">
        <DocLink
          title="Agent runtime & delegation"
          body="The org chart is an enum; delegation is a tool the LLM calls every turn. Child context isolation, parallel forks, and tool partition v2."
          href="/docs/agent-runtime"
        />
        <DocLink
          title="The tools an AI uses"
          body="Built-ins, skills, MCP, subordinate agents — how four kinds of capability collapse into a single tool_use interface."
          href="/docs/tools"
        />
      </div>
    </div>
  );
}

function DocLink({
  title,
  body,
  href,
}: {
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group grid grid-cols-12 gap-6 border-t border-rule py-8 transition-colors hover:bg-background-alt"
    >
      <div className="col-span-12 sm:col-span-10">
        <h3 className="font-display text-[24px] leading-[1.2] tracking-[-0.01em]">
          {title}
        </h3>
        <p className="mt-2 max-w-2xl text-[15px] leading-[1.65] text-muted-foreground">
          {body}
        </p>
      </div>
      <div className="col-span-12 flex items-start sm:col-span-2 sm:justify-end">
        <ArrowRight
          size={18}
          weight="regular"
          className="text-muted-foreground transition-colors group-hover:text-foreground"
        />
      </div>
    </Link>
  );
}

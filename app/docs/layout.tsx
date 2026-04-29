import Link from "next/link";

const NAV = [
  {
    title: "Engineering",
    items: [
      { href: "/docs/agent-runtime", label: "Agent runtime & delegation" },
      { href: "/docs/tools", label: "The tools an AI uses" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-8">
      <div className="grid gap-16 py-16 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="space-y-8">
            {NAV.map((group) => (
              <div key={group.title}>
                <p className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
                  {group.title}
                </p>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="-mx-2 block rounded px-2 py-1.5 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>
        <article className="min-w-0">{children}</article>
      </div>
    </div>
  );
}

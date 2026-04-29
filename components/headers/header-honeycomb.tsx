"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

const HEX_CLIP =
  "polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)";

type Cell = {
  label: string;
  href: string;
  external?: boolean;
  match?: (pathname: string) => boolean;
};

const cells: Cell[] = [
  {
    label: "DOCS",
    href: "/docs",
    match: (p) => p === "/docs" || p.startsWith("/docs/"),
  },
  {
    label: "GITHUB",
    href: "https://github.com/openhivelabs/openhive",
    external: true,
  },
];

export function HeaderHoneycomb() {
  const pathname = usePathname();

  return (
    <header className="relative z-20 bg-transparent px-4 pt-5">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-[22px] border border-border bg-background px-5 py-3 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)] dark:border-white/10 dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]">
        <Link href="/" className="flex items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
          <span className="text-[14px] font-semibold tracking-tight">OpenHive</span>
        </Link>

        <nav className="flex items-center gap-2">
          <ul className="flex items-center gap-1">
            {cells.map((cell) => {
              const active = cell.match?.(pathname) ?? false;
              const cellInner = (
                <span
                  className={[
                    "inline-flex h-[44px] w-[60px] items-center justify-center text-[10.5px] font-bold tracking-[0.06em] transition-colors",
                    active
                      ? "bg-amber-400 text-zinc-950"
                      : "bg-stone-200/70 text-muted-foreground hover:bg-stone-300/70 hover:text-foreground dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/20 dark:hover:text-white",
                  ].join(" ")}
                  style={{ clipPath: HEX_CLIP }}
                >
                  {cell.label}
                </span>
              );

              return (
                <li key={cell.label}>
                  {cell.external ? (
                    <a
                      href={cell.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={cell.label}
                    >
                      {cellInner}
                    </a>
                  ) : (
                    <Link href={cell.href} aria-current={active ? "page" : undefined}>
                      {cellInner}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

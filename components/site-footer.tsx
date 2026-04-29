import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-8">
        <div className="h-px bg-rule" />
        <div className="flex flex-col gap-5 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px]">© 2026 OpenHive. Open source under MIT.</p>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <a
              href="https://github.com/openhivelabs/openhive"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/openhiveai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              npm
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

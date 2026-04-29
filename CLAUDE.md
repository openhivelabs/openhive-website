## Working Principles (Karpathy)

- State assumptions explicitly. If multiple interpretations exist, surface them — don't pick silently. If something is unclear, stop and ask.
- Push back when warranted. If the user's ask has a flaw or a simpler path exists, say so — don't just comply.
- Convert imperative tasks ("add X", "fix Y") into verifiable goals (test that fails → make it pass; tests green before AND after refactor).
- For multi-step work, decompose as `1. step → verify: check` and execute step by step.

## Project: OpenHive marketing & docs site

Public-facing site for the OpenHive open-source agent platform (`openhivelabs/openhive`). Source for this site is also published as open source — no secrets in the repo.

- **Language: English only.** All copy, UI strings, docs, and metadata are in English. Do not introduce i18n / translations.
- **Stack: Next.js 16 (App Router) + React 19 + Tailwind v4 + Turbopack.** This is Next 16 — APIs and conventions differ from older Next. Read `node_modules/next/dist/docs/` before using a feature you're not sure about.
- **Theme: light + dark, both required.** Use a class strategy with system-preference default. No theme-locked components.
- **Pages (current scope): `/` (intro) and `/docs` (architecture & reference).** Blog deferred — not added until there's actual content. Changelog, if added, mirrors GitHub Releases.
- **Product facts to keep accurate:**
  - Install: `npm i -g openhiveai` → run `openhiveai`. Also `npx openhiveai` for try-without-install.
  - Cross-platform: macOS / Windows / Linux.
  - GitHub: `https://github.com/openhivelabs/openhive`.
  - One-liner: local-first, self-hosted, single-user AI agent orchestration platform. Design an agent "company" on a canvas; watch execution on the same canvas (Design / Run toggle).
- **Icons & metadata files** live in `app/`: `favicon.ico`, `icon.svg`, `apple-icon.png`, `opengraph-image.png`, `twitter-image.png`. Static assets unrelated to metadata go in `public/`. UI icons via `@phosphor-icons/react`.
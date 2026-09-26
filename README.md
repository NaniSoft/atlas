# Atlas

> Model the real world digitally. First domain: a digital **twin** of the IT estate.

Part of the [NaniSoft](https://www.nanisoft.com) web platform — five sites, one design language ([Prism](https://prism.nanisoft.com)).

- **Live**: https://atlas.nanisoft.com (Custom Domain, auto-created on deploy)
- **Pack**: green mode-switchable, beam-dark by default
- **Stack**: Next 16 static export · fumadocs-mdx · pnpm · TypeScript strict · oxlint · Vitest · Cloudflare Workers
- **Chrome**: [@nanisoft/prism-ui](https://www.npmjs.com/package/@nanisoft/prism-ui) (SiteHeader / SiteFooter) — npm dependency, never copied into this repo

## What ships

- **Landing** (`/`) — the product-site template's variant A, "The Instrument Bench": split hero with the twin in an instrument panel, status ticker, six numbered hairline sections, the data path as a conveyor rail, use cases as a status ledger, integrations as a survey grid, Built on Nexus, closing CTA.
- **Docs** (`/docs`) — Introduction, Concepts, Architecture, Guides, Reference over `content/docs/`.
- **Blog** (`/blog`) — the four launch posts over `content/blog/` (folder-per-post, required date, drafts excluded).
- **About** (`/about`) — the product's story: estates → twin → traversal.

Honesty devices are content, not chrome: use-case statuses (access traversal = available; blast radius and stale & unused access = planned) and the playground, always described as fully mocked.

## Develop

```bash
pnpm install
pnpm dev      # bake + dev server
pnpm build    # bake + static export to out/
pnpm test
pnpm lint
```

## Deploy

Push to `main` → GitHub Actions builds and deploys the Worker (`atlas-site`). Pull requests run CI (lint → test → build).

## Status

Live. Built on the scaffold from wayfinder ticket 05; the effort map lives in the Nanisoft workspace at `.scratch/nanisoft-web/map.md`. Branch `prototype/atlas-landing` is the preserved primary source for the product-site landing template (ticket 09) — not part of this site.

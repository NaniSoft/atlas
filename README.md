# Atlas

> Model the real world digitally. First domain: a digital **twin** of the IT estate.

Part of the [NaniSoft](https://www.nanisoft.com) web platform — five sites, one design language ([Prism](https://prism.nanisoft.com)).

- **Live**: https://atlas.nanisoft.com (Custom Domain, auto-created on deploy)
- **Pack**: green mode-switchable, beam-dark by default
- **Stack**: Next 16 static export · fumadocs-mdx · pnpm · TypeScript strict · oxlint · Vitest · Cloudflare Workers
- **Chrome**: [@nanisoft/prism-ui](https://www.npmjs.com/package/@nanisoft/prism-ui) (SiteHeader / SiteFooter) — npm dependency, never copied into this repo

## What ships

- **Landing** (`/`) — "The Instrument Bench": split hero with the twin in an instrument panel, a status ticker beneath it, then five hairline-topped sections numbered 01–05 (the twin · the data path as a conveyor rail · use cases as a status ledger · integrations as a survey grid · Built on Nexus) and a closing CTA.
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

Content lives under `content/docs` and `content/blog`; `lib/source.ts` is the only place the fumadocs collections are declared, and the blog is folder-per-post with a required ISO `date`, optional `tags`, and `draft` (drafts never export). `test/content.test.ts` asserts the docs IA by reading `content/` off disk — fumadocs' loaders are compile-time macros and cannot run under vitest.

## Deploy

Push to `main` → GitHub Actions builds and deploys the Worker (`atlas-site`). Pull requests run CI (lint → test → build). `pnpm deploy` is the local lane, and needs wrangler auth.

## Status

Live at https://atlas.nanisoft.com, serving a static export from the `atlas-site` Worker. One use case is available today — access traversal; blast radius and stale & unused access are planned, and the playground is a fully mocked in-browser tour rather than a running platform.

The wayfinder map these sites were built from is retired, and it and its ticket numbers are gone from this repo's documents. The standing references are `CONSISTENCY.md` (the five-repo consistency contract) and `AGENTS.md` (this repo's own scope, stack, and commands).

The local branch `prototype/atlas-landing` preserves the three product-site landing-template variants the shipped landing was drawn from. It exists only in this working clone — `origin` carries `main` alone — so a fresh clone does not have it. The landing that ships is self-contained under `components/landing/`.

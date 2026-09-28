# AGENTS.md — Atlas

## Project

**atlas.nanisoft.com** — Atlas, the Digital Twin Platform — living models of real systems. Landing + full docs + blog, in the mint pack.

Part of the five-site Nanisoft web platform (www + nexus + atlas + alphalens + prism), one design language: Prism.

## The one rule

Compose from the design system's catalogue. There is no local component and no local override path: a section this site needs and the catalogue does not have is a finding to report, not a component to write.

- Items come from their own subpath, never the root barrel: `@nanisoft/prism-ui/blocks/<item>`, `/components/<item>`, `/pages/<page>`, and `/theming` for the pack and mode vocabulary. The one exception is `@nanisoft/prism-ui/pages`, which is the barrel the documentation template already imported by name before this rule existed, and the design system publishes `DocsShell` under it.
- `@nanisoft/prism-ui/styles.css` is imported once, in the root layout, before this site's own sheet. It carries every token, every utility and every base rule.
- A Block takes data and content as props. If one cannot express something, the answer is upstream.
- A consumer cannot write a Prism utility class: the consumer does not run Tailwind, so a utility exists in the emitted sheet only if a Prism component already uses it. Anything this site needs for itself goes in `app/globals.css` as a site class.

## Theming

Two attributes on `<html>`, and nothing else: `data-pack` for the ground and `class="dark"` for the mode, both from `lib/site.ts`. A blocking `PrismThemeScript` in `<head>` applies a stored choice to them before first paint, and is the only writer of the theme's origin. There is no provider, no client runtime, no baked stylesheet and no pack class. A page is correct with scripting disabled.

A pack boundary is an attribute on an element: it repoints that pack's colour **and** its corner radius beneath it, and it wears the mode of the nearest ancestor carrying `.dark`. So a boundary belongs on a fully rounded mark and nowhere else. The site's pack map is `scripts/pack-map.json`, and it is checked from the built export in both modes.

## Wayfinding

This file is this repository's own instructions. `README.md` is what the site is and how it is built and deployed. `CONSISTENCY.md` is the cross-repository law, and the pinned package version is its version. The published docs are `content/docs/`; `content/blog/` is the blog. The wayfinder map these sites were built from is retired, so its ticket numbers are history — don't cite them.

## Stack

- Next 16 static export (`output: 'export'`) at the repo root — flat single-app, no workspace.
- pnpm + TypeScript strict + oxlint + Vitest (jsdom + Testing Library).
- No client component anywhere: every page is a server component, so the site ships no JavaScript of its own. `test/server-only.test.ts` asserts the shape of the whole source tree, so a `'use client'` line cannot be added without failing a test.
- Deploys: push to main → GitHub Actions runs the checks and then the deploy (`wrangler deploy`) with the org-level Cloudflare secrets. The deploy is a job that needs the checks, so a push that fails cannot deploy.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — static export to `out/`
- `pnpm lint` / `pnpm typecheck` / `pnpm test`
- `pnpm check` — the gates (see README); run it after `pnpm build`, because three of them read the built export
- `pnpm deploy` — build + wrangler deploy (local wrangler auth)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

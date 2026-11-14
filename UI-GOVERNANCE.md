# UI Governance — Inventory, mapping, and migration record

This file is the mission's Phase 1 evidence and the running record for Phases 2–10.
It mirrors the brief §1–§18 and names what exists, what maps where, and what was
requested upstream instead of worked around locally.

## 1. Initial repository assessment (inventory of violations, before any change)

### Stack facts

- Next 16 static export (`output: 'export'`), React 19, TypeScript strict, pnpm.
- One first-party visual dependency, listed exactly: `@nanisoft/prism-ui@1.7.1`,
  which brings `@nanisoft/prism-tokens@1.7.1` transitively. No second
  declaration of the token package exists in `package.json` or
  `pnpm-workspace.yaml` (the `pin` gate asserts this).
- No Tailwind, Bootstrap, styled-components, Emotion, JSS, or CSS-module
  dependency. The consumer runs no Tailwind: a utility class exists in the
  emitted sheet only if a Prism component already uses it.
- Baseline at assessment time: `@nanisoft/prism-ui@1.7.0`; upgraded to
  1.7.1 — `pnpm ls` confirms lockfile resolution of both first-party packages,
  gates, unit tests, and the production build are green on 1.7.1.
- `pnpm outdated` at assessment time: patch/minor updates available for
  `next`, `react`/`react-dom`, `zod`, `fumadocs-*`, `@types/node`, `oxlint`,
  `vitest`, `wrangler`, `jsdom`. `@nanisoft/prism-ui` is already at the
  latest 1.7.0 and is pinned exact, which the `pin` gate requires.
- Tests: `vitest run` (jsdom + Testing Library) + `prism-gates` (7 gates plus
  `token-read`, so 8 report). CI (`.github/workflows/ci.yml`): lint,
  typecheck, test, build, then `pnpm check`, with deploy gated on `verify`.
- Runtime/visual: no Playwright, no axe, no visual-regression baselines existed.

### Violations inventoried (before the migration edits in §2)

| Area | Finding |
|---|---|
| Stylesheets | `app/globals.css` — 452 lines. One sheet, grouped as: hero scale + padding (`.site-hero h1`, `.site-hero`), figures grid + annotation collapse + figure colors (`.site-figures`, `@media` × 2, `.site-figure__*`), logo (`site-logo*`, `site-panel-logo`, `site-product-mark`), docs index (`.site-index*`), blog index (`.site-blog-list*`, `.site-blog-list__*`), `.site-main`, `.site-actions`, `.site-band`, footer (`.site-footer-about`). Class-scoped only, tokens only, no bare-element rules — but present, and under Zero-Custom-UI every line is a violation. |
| Inline styles | `app/opengraph-image.tsx` — dozens of `style={{…}}` props + hex literals (`#161917`, `#ebeeeb`, …). Next `ImageResponse` renders a bitmap with no cascade, so tokens cannot resolve. Under a no-exception reading this file itself is the violation. |
| Hardcoded colours | `app/icon.svg` (fixed brand hex `#161917/#ebeeeb/#9ddcad`); `app/opengraph-image.tsx` (hex + `SPECTRUM` gradient). Both are outside the token cascade by platform requirement (favicon chrome, OG bitmap) — recorded here as fixed-colour brand surfaces, not page styling. |
| Arbitrary / site classes | Site classes in TSX: `site-index*`, `site-blog-list*`, `site-figures`, `site-hero`, `site-media-band`, `site-actions`, `site-product-mark`, `site-panel-logo`, `site-footer-*`, `site-figure__*`, `site-logo*`, `site-main`, plus `site-mono`, `site-empty`, `site-atmosphere`, `site-footer-tagline`, `site-index--blog` (no matching rule), `site-index__group` (no matching rule). `site-atmosphere` and `site-media-band` have no rule at all. DS utilities on native elements: `flex flex-col gap-2`, `hidden sm:block`, `border-border … pb-2`, `text-[11px]`, `fill-primary`, `stroke-border`, etc. (`components/twin-finding.tsx`); `block h-auto w-full`, `h-full w-full` (figures, `estate-editorial.tsx`); `w-full min-w-0`, `border-border mt-3 border-t pt-3` (`app/page.tsx`). |
| Responsive | Custom `@media` in `app/globals.css` at 1024px and 639px; responsive variant utilities in TSX (`sm:block`, `sm:hidden` in `twin-finding.tsx`). |
| SVG / icons | Inline JSX `<svg>` in `components/logo.tsx` (`AtlasLogo`, duplicates DS `AtlasMark`), `components/estate-graph-figure.tsx`, `components/traversal-figure.tsx`, `components/twin-finding.tsx`, `components/estate-editorial.tsx` — all token-inked, no hex, but locally drawn. `app/icon.svg` route icon (file, not JSX). No `lucide-react` import anywhere in app source (it arrives transitively via `prism-ui` and headless `fumadocs-core` at the same 0.545.0). |
| Fonts | None site-owned. DS ships Inter as three static woff2 files with `@font-face` in its own sheet. No `next/font`, no `@font-face`, no external font import. Clean. |
| Images | `public/` holds only `.gitkeep`. No `<img>` in page code, no `next/image`, no raster. The only image pipeline is the OG route handler (bitmap, see above). |
| Layout primitives | Hand layout: figure grid, CTA row, index lists, footer/about column, hero padding. No `DSGrid`/`DSStack` usage anywhere. |
| UI libraries | `fumadocs-core` + `fumadocs-mdx` — used **headless**: only `loader`, `pageSchema`, `defineDocs`/`defineCollections` (source pipeline) and `fumadocs-core/page-tree` types. Zero `fumadocs-*/ui` imports, zero Fumadocs chrome; docs render through Prism `DocsShell` + `Prose`. They are the content pipeline (data/workflows), not a visual design language. `next/og` is the bitmap renderer for the OG route. |
| Gate/CI gap | Mission codes `UI001–012` / `ASSET001–014`, command `npm run ui:check`, Playwright runtime gates, asset manifest, negative fixtures — none existed. Prism gates cover ownership/token/reads but not the mission's full code set. |

## 2. Mapping to design-system equivalents

| Site surface today | Design-system equivalent | Notes |
|---|---|---|
| `AtlasLogo` (`components/logo.tsx`) | `AtlasMark` (`@nanisoft/prism-ui/components/product-marks`, manifest `mark-atlas`) | Same drawing, same viewBox, token ink. Delete local component. |
| `TwinFinding` (hand SVG + mobile list + caption) | `Diagram` (`@nanisoft/prism-ui/components/diagram`) + `InstrumentPanel01` caption | Nodes: person/product/group. `viewed` solid relation; missing membership as `indirect` (dashed). Diagram scrolls sideways at legible size on phones, which replaces the hand mobile list. |
| `EstateGraphFigure` (hand SVG) | `Diagram` inside `InstrumentPanel01` | 4 sources converging on one emphasis node; relation labels `conform/membership/grant/activity` carry the three relationship kinds the copy already states. Rects/boundary ring/legend have no Diagram form and are dropped. |
| `TraversalFigure` (hand SVG) | `Diagram` inside `InstrumentPanel01` | One person → Sensitive product (emphasis), three relations labelled `Membership / Direct grant / Inherited right`. |
| `EstateEditorial` (hand SVG in `MediaBand01.media`) | `Diagram decorative` in the same slot | 14 nodes, 18 relations. No emphasis (one-emphasis rule). Decorative because the band title/description carry the meaning. |
| Doc/blog index lists (`.site-index*`, `.site-blog-list*`) | `Section` + `Heading`/`Text` (typography) + `ListPanel` + `Item` rows | Item gives the row (title/description/meta/href) without classes on natives. Group labels become `Heading as="h2"`. Empty state is `Text tone="muted"`. |
| Footer “about” (`.site-footer-about`) | `Text tone="muted" size="sm"` × 2 | Tagline + sentence, DS type steps only. |
| Figures grid (`.site-figures` @1024px) | `DSGrid columns={2}` | DS owns below-`sm` = 1 column. |
| CTA row (`.site-actions`) | `DSGrid columns={3}` | DS owns wrap/count; buttons keep DS size/variant props. |
| Hero padding/scale (`.site-hero`) | `Hero01` defaults | No DS scale slot exists today (see §4 request). Default `SectionHeading` scale wins. |
| Page frame (`.site-main` min-height) | Bare `<main>` | No DS sticky-footer primitive in the published API (see §4 request). |
| OG card (`opengraph-image.tsx`) | Static committed PNG, DS-governed via the asset manifest | The bitmap that the route generated is committed once to `public/opengraph-image.png` and referenced from metadata. No inline styles, no `<img>` element. |
| Favicon (`app/icon.svg`) | File asset, registered in `assets/manifest.json` | Route-icon convention; fixed brand colours. Same exemption DS grants its own `prism-icon-svg` manifest entry. |

`DSImage`, `DSIcon`, `DSLogo`, `DSAvatar`, `DSIllustration`, `DSVideo`,
`DSMediaCard` are now the only sanctioned media/icon components. There are no
local icons to replace — there never were; the registry path is the only icon
path and the gate fails any other.

## 3. Zero-Custom-UI rules as enforced by `ui:check`

`npm run ui:check` (see `scripts/ui-check.mjs`) prints
`CODE: path:line — fix`. It is AST-based (TypeScript compiler API over
`app/`, `components/`, `lib/`), stylesheet-parsing (site CSS), and
manifest/lockfile-aware. It does not rely on regex alone.

- `UI001` custom stylesheet detected — any local `.css/.scss/.less/.styl`
  in source roots, or any `import '…/…css'` outside the one documented DS
  entry (`@nanisoft/prism-ui/styles.css`, imported exactly once in the root
  layout).
- `UI002` inline styles detected — any `style=` JSX attribute.
- `UI003` hardcoded colours detected — `#hex`, `rgb(`, `hsl(` in TSX/CSS
  source strings (comments excluded).
- `UI004` arbitrary styling classes detected — any `className` on a **native**
  HTML element, any `site-*`/unknown class value, any arbitrary `[…]` value,
  any class value that is not a DS-published class present in the installed
  `@nanisoft/prism-ui/styles.css`, any `className` string built by template
  interpolation. `className` on DS components is layout-only passthrough and
  is allowed **only** when every token is DS-published; DS APIs document it as
  layout-only on every component, so the gate governs values, not the prop.
  Native anchors inside DS `Prose`/`Item` are authored by DS, not matched
  here.
- `UI005` unapproved UI component imports — importing primitives from
  anything outside `@nanisoft/prism-ui`.
- `UI006` custom CSS variables — `--*` declarations or `--*` strings in site
  source.
- `UI007` unapproved styling dependencies — only the documented production
  set may be declared; anything else that styles (`tailwindcss`,
  `styled-components`, `@emotion/*`, `bootstrap`, `jss`, …) fails.
- `UI008` design-system overrides — a DS-component `className` whose value is
  a site/unknown class, or `!important` / `--*` / inline `style` aimed at a
  DS surface.
- `UI009` unapproved font imports — `@font-face`, `next/font*`, font CSS
  imports, `fontFamily`/`font-family` literals in site source.
- `UI010` direct DOM styling — `style.` mutation, `document.…style`,
  `setProperty(` on site elements.
- `UI011` unapproved responsive styling — `sm:/md:/lg:/xl:` variants in site
  `className`, `@media` in site CSS, custom breakpoints in site source.
- `UI012` locally implemented visual primitives — native
  `<button>/<input>/<textarea>/<select>/<dialog>` in site source.
- `ASSET001` raw image rendering — `<img>`, `next/image`, `next/og` image
  JSX in site page code.
- `ASSET002–006` asset shape — variant/max-rendered mismatch, aspect mismatch,
  missing manifest entry, invalid format, size budget. Variants and budgets
  come from the DS manifest (`dist/assets/manifest.json`); site assets are
  declared in `assets/manifest.json`.
- `ASSET007` invalid/unsafe SVG — `<script>`, event handlers, `foreignObject`,
  `data:` active content in a checked SVG.
- `ASSET008` unapproved SVG/icon import — inline JSX `<svg>`, importing
  `*.svg`, a second icon package.
- `ASSET009` unapproved font — a font file under `public/` absent from the
  manifest, or a non-woff2 font.
- `ASSET010` arbitrary object-fit/position — `object-fit`/`object-position`
  declarations or `object-*` class tokens in site source/CSS.
- `ASSET011` responsive-asset contract violation — `srcSet/sizes` on a raw
  image, or a `DSImage` responsive form that names a non-governed size.
- `ASSET012` missing intrinsic dimensions — `DSImage` without
  `width`+`height`.
- `ASSET013` insufficient source resolution — source under 2× max rendered.
- `ASSET014` presentation bypass — `objectFit`, `aspectRatio` or `width`
  (rendersize) overrides on `DSImage`/`DSLogo`/`DSIllustration`, or a
  `className` carrying `aspect-`/`object-` on a media component.

Negative fixtures under `test/fixtures/ui-negative/` each violate exactly one
code and are asserted failing by `test/ui-check.test.ts`. Positive fixtures
under `test/fixtures/ui-positive/` assert that approved composition passes.
Fixtures are excluded from the production scan (they live under `test/`).

## 4. Missing design-system capabilities (filed, not worked around)

1. Hero title scale slot — `Hero01` caps its heading at `sm:text-4xl` and its
   `className` lands on the `Section`, not the heading. The site's product
   landing has one sanctioned larger step. Needs a `titleSize` prop on
   `Hero01`/`SectionHeading`.
2. Documentation index and blog index items — DS deliberately ships no index
   Page. Needs an `IndexList` primitive (ListPanel + Item already cover the
   row; a governed list container for grouped indices is the gap).
3. Sticky-footer page frame — `.site-main { min-height: 100dvh }` has no
   `PageLayout` equivalent in the published API.
4. OG image surface — there is no DS component for the share card; a static
   DS-registered asset is the compliant substitute for a bitmap generator.
5. HStack/Inline layout — `DSStack` is a column and `DSGrid` is tracks. A row
   of CTAs is expressed with `DSGrid columns={3}`, which is a grid where a row
   is wanted. Needs a governed inline primitive if the grid proves wrong.

## 5. Definition of done

- [x] No custom UI stylesheets (`app/globals.css` deleted; only the DS entry remains).
- [x] No inline styles (OG route deleted; static DS-governed PNG committed).
- [x] All visual components from the central design system (Diagram/Item/
  Heading/Text/DSGrid/ListPanel/AtlasMark; no native primitives).
- [x] Colours/typography from approved themes and tokens (mint pack +
  light/dark via `data-pack`/`dark` + DS type steps; hex only in fixed-colour
  brand files registered in the manifest).
- [x] Icons from the central registry path (no icons authored; DSIcon only).
- [x] Images via approved presentation components (none rendered in pages;
  OG card is a committed static asset).
- [x] Site assets validated (manifest + `ui:check` ASSET gates).
- [x] Responsive behaviour from DS (DSGrid/DSStack; no `@media`).
- [x] No competing styling dependencies (production set allowlisted).
- [x] Automated checks pass (see verification below).
- [x] Negative fixtures prove rejection; positive fixtures prove composition.
- [x] Production build independent of the DS source repository (published
  package only; public subpath imports only).

## 6. Prism 1.8 adoption (this audit's record)

The 1.8 release audit adopted the upstream surfaces this site's composition could
take, verified the rest against the rendered export at the widths the site ships
at (390, 768, 1280, 1920; light and dark), and filed what it could not take.

### Adopted

- `@nanisoft/prism-ui` 1.7.1 to 1.8.0, exact (the `pin` gate holds).
- **`Ground01` replaces the hand assembly.** `app/page.tsx` rendered
  `HeaderTransparency` + `AuroraWash` + `TsparticlesField` as three siblings;
  that is the drift the Block exists to end. The landing now renders one
  `Ground01` (`wash`, `particles`, `transparentBar` default to the composition
  the page had). The page's `main`, which the chrome renders, carries the
  `site-main` slot the ground's stacking contract names
  (`components/site-chrome.tsx`); with it `main` becomes a stacking context at
  `z-index: 1`, which is what makes 1.8's positioner `z` load-bearing here.
- **Popup stacking verified, nothing to delete.** No consumer z-index override,
  elevated wrapper or hand-rolled popover existed in this source tree (grep and
  the stylesheet-ownership gate's empty sheet list). The family menu, the search
  dialog and the mobile panel open above the hero's instrument panel with
  `main` at `z-index: 1`, clicked at both shipping widths.
- **Mode words name destinations, already true.** The bar's toggle reads
  "Switch to light mode" while dark (`aria-pressed`), from `lib/bar.ts` copy.
- **The family's marks, already worn.** Every family member with a drawing wears
  it: the bar's menu, the landing's product rows, and the chrome's lockup. No
  two-colour disc is drawn for a member that has a mark.
- **Mode-first render, not applicable.** This site mounts no provider at the
  root (the declarative attributes + boot script) and `defaultMode` is the
  explicit `dark`; the dark-system emulation ran with a clean console on the
  landing and the docs index.
- **Veil scale, nothing to move.** No alpha literal exists in this source tree;
  the translucent surfaces the page shows are the library's, which 1.8 prices
  on the `veil` scale.
- **Swatches and base path, not applicable.** This site deliberately refuses the
  pack chooser (recorded in `lib/bar.ts`), so it renders no swatch; it is hosted
  at a zone apex (`atlas.nanisoft.com`), so the route-derived gates declare no
  `basePath`.

### The bar's playground, decided rather than adopted verbatim

The 1.8 `mobileOnly` pair assumes the consumer can hide the cluster's CTA below
the width it stops fitting at. This repository can express neither half of that
pair: the published sheet emits only the utilities its own components use, so
`hidden` and `sm:inline-flex` name no rule in it (the baseline build measured
the cluster plus CTA at 511px against a 390px viewport, pushing the panel's own
trigger off the viewport), and this repository's gate fails any variant class a
consumer writes (UI008/UI011, verified findings before the fix). So the
playground is a nav entry (`lib/bar.ts`): a row link above the panel's
threshold, carrying `newTab` because the destination leaves the site, and a
panel entry below it. The cluster keeps the four controls it can afford at
every width; the ask stays on the page in the hero's actions and the closing
band. The panel's entry navigates in place, because `MobileNavLink` carries no
`newTab`: filed upstream below.

### Filed upstream (recorded here, not worked around)

1. **`DSGrid`'s one-column-below-`sm` does not constrain the track.** The
   narrowing is implicit (no template at phone width), so an auto track sizes
   to its content's max-content. The figures section's two `InstrumentPanel01`
   figures each hold a `Diagram` with a 640px legible floor, and at 390px the
   section measures 698px: the page scrolls sideways on every landing visit.
   The primitive's own documentation claims the narrowing keeps tiles legible
   at 390px; a `minmax(0, 1fr)` template (what `grid-cols-1` compiles to)
   would hold that claim. Measured on 1.8.0.
2. **The published sheet cannot express the documented `mobileOnly` pair.** The
   site-navbar documentation prescribes holding a cluster destination in the
   panel with `mobileOnly`, and the design system's own site hides its CTA with
   `hidden xl:inline-flex`. A consumer of the published sheet can write neither
   class: `.hidden` and `.sm\:inline-flex` are not in `dist/styles.css`. Needs
   either the display utilities (and an exemption in the consumer's variant
   gate) or a governed responsive arm on the bar's `actions` slot.
3. **Panel entries carry no `newTab`.** `SiteNavLink` accepts `newTab` and the
   row honours it, but the panel's `MobileNavLink` has no such field and the
   panel drops it silently. An external destination held in the panel navigates
   in place. This site asserts the split (`test/pack-map.test.tsx`) rather than
   pretending the entry is the row's link.
4. **`TsparticlesField` can die loudly at unload.** Under parallel page loads
   (the visual suite's four projects), the engine threw an uncaught
   `TypeError: TSP-1101` (`OffscreenCanvas is required but not supported`) on
   pages that never render the field, because the engine's chunk executes via
   prefetch on every route. Serial loads are clean; the trigger is a load/unload
   race, not a browser capability. Worth a guard or a passive preload.
5. **Polish, minor:** the hero's finding `Diagram` clips its subject at 1440
   (the 640px floor inside a narrower panel) with no visible affordance that it
   scrolls sideways. The bargain is documented; the affordance is not.

### Verification record (this audit)

- `pnpm build`, `pnpm lint` (5 pre-existing warnings at HEAD), `pnpm
  typecheck`, `pnpm test` (76 passing), `pnpm ui:check` (0 findings), `pnpm
  check` (gate kit 2: 7 gates, 0 findings, `view-only` included).
- Visual suite over the production export: 20/20 across mobile, tablet,
  desktop, wide-desktop, including the routes the suite had never actually
  rendered (see the serve defect below). The committed landing-light baselines
  held; docs/blog/about baselines now exist against the real pages.
- Rendered checks: the bar's cluster fits 390px with the trigger in view; the
  panel lists Docs, Blog, About and the playground; the family menu and the
  search dialog open above the instrument panel in both modes; the console is
  clean on every route in dark and on a dark-system emulation; axe (WCAG A/AA)
  reports no critical or serious violation on the landing at both widths.
- axe on the docs/blog/about routes was run only through the visual suite's
  tags, after the serve fix; the suite's axe step covers all four routes.

### Infra defect found and fixed here

`playwright.config.ts` served the export with `serve -s`, which rewrites every
route without a directory index to the landing. Every docs/blog/about capture
the suite had ever taken was the landing wearing another name, and this audit's
first per-route probes measured the landing four times. Plain static mode
resolves the export's clean URLs the way the Worker's `html_handling` does at
the host; the config now runs `serve out`.

## 7. Filings closed (Prism 1.9.0)

Section 6 filed five findings upstream. Prism 1.9.0 closed four in code and one
by decision, and this site moved to the release the same day.

1. **`DSGrid`'s one-column narrowing is an explicit `grid-cols-1` template**
   (`repeat(1, minmax(0, 1fr))`), so a tile carrying its own legible floor
   overflows inside itself rather than sizing the implicit track and scrolling
   the page. The figures section's 698px-at-390px measurement is gone: the
   landing's phone width is clean end to end.
2. **The sheet emits `hidden`, `sm:inline-flex` and `xl:inline-flex`**, the pair
   the site-navbar documentation prescribes, via `@source inline` in the
   stylesheet source. This site's bar carries the documented arrangement now:
   the cluster CTA steps out below `sm` and the `mobileOnly` panel entry holds
   the destination there. The variant gate (UI011) reads the sheet for variant
   classes the same way UI008 reads it for plain ones, so what Prism publishes
   is what this repository may write, and a variant no rule answers is still a
   finding.
3. **The panel's entries carry `newTab`.** The `mobileOnly` playground entry
   opens in a new browsing context like every other rendering of the
   destination, asserted by opening the panel in the pack map suite.
4. **`TsparticlesField` owns its engine call.** Serialized loads, a container
   that arrives after an unmount destroyed on arrival, rejections carried to
   `console.warn`: the `TSP-1101` uncaught page error cannot recur. (The
   publish itself rode the maintainer's npm identity, because the package has
   no trusted-publisher binding on the registry and the workflow's OIDC path
   404s; binding it is a registry-side step recorded in the workflow's own
   comments.)
5. **The hero `Diagram`'s scroll affordance is closed as a decision, not a
   change.** The sideways bargain is the Component's documented contract, the
   container is functional, and the affordance question is the same one the
   migration already filed upstream against `Diagram` (the
   `scrollable-region-focusable` exemption in the visual suite). A drawn
   affordance is design work on the catalogue, not a defect this site holds.

Adopted with the release: `@nanisoft/prism-ui` pinned at 1.9.0, the canonical
`mobileOnly` pair in the bar (this section's item 2 and 3 together), and the
audit's second axis is closed: every Prism-drift finding from the 1.8 audit is
either adopted upstream or recorded here as a decision.

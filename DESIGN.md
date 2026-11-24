---
name: Atlas (atlas.nanisoft.com)
description: The Digital Twin Platform: a mint-lit ground where the IT estate and its living twin are drawn as one graph.
colors:
  beam: "#9ddcad"
  on-beam: "#001f0a"
  beam-day: "#73bf88"
  ground: "#161917"
  ground-day: "#ebeeeb"
  ink: "#ebeeeb"
  ink-day: "#2b2f2c"
  muted-ink: "#c7ccc8"
  muted-ink-day: "#575c58"
  wash: "#045026"
  wash-day: "#d4f7dc"
  hairline: "#3f4440"
  hairline-day: "#dbdfdc"
  glass-card: "rgba(235, 238, 235, 0.07)"
  rail-glass: "rgba(63, 68, 64, 0.88)"
  brand-ink: "#bcecc7"
  brand-ink-day: "#1c6c3b"
  ray-cyan: "#7fdaf0"
  ray-mint: "#9ddcad"
  ray-gold: "#edc47d"
  ray-sky: "#9bd1ff"
typography:
  display:
    fontFamily: "Inter, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 600
  heading:
    fontFamily: "Inter, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 600
  body:
    fontFamily: "Inter, Inter Fallback, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 400
    fontSize: "1rem"
  label:
    fontFamily: "ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.625rem"
    letterSpacing: "0.1em"
rounded:
  xs: "0.125rem"
  sm: "0.375rem"
  base: "0.625rem"
  xl: "0.875rem"
  4xl: "1.625rem"
spacing:
  unit: "0.25rem"
  section: "4rem"
  section-wide: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.beam}"
    textColor: "{colors.on-beam}"
    rounded: "{rounded.base}"
  button-outline:
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
  card:
    backgroundColor: "{colors.glass-card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
---

# Design System: Atlas (atlas.nanisoft.com)

## Overview

**Creative North Star: "The Living Mirror"**

The estate in ink, its twin in mint: the mark draws reality and its living representation mirrored across a peak node, and the whole site keeps that double image. Atlas models the real world digitally, and its first proven domain is a digital twin of the IT estate, so everything on the page is a graph seen from above: a twelve-node hero figure with a marker traveling its lanes, a fourteen-node editorial network, ledger rows that state which parts of the twin are live and which are planned. The mint pack lays a quiet botanical green over a near-neutral dark ground; the beam is a soft leaf light used sparingly, the way a surveyor uses a highlighter.

Atlas is the drawing site of the family, and its drawings transcribe copy: every figure is a design system Diagram whose nodes and edges are literally the words the adjacent text publishes, framed in an instrument panel with a caption that says what the drawing is ("A schematic of the estate, not a photograph"). The drawings claim nothing: the hero panel carries no status word and never claims live, because drawings may not assert freshness over authored data. The site's voice is declarative and engineering-literal, and the em dash is its deliberate punctuation.

The site ships zero CSS of its own. Every value below arrives through the pinned `@nanisoft/prism-ui@1.13.0` stylesheet (`data-pack="mint"`), which is normative; these figures are a snapshot of that pin. Dark is the default rendering and the `-day` siblings are the light mode. The only pixels Atlas authors are its favicon, which quotes the mint dark values verbatim, because a favicon is an image, not a surface.

**Key Characteristics:**
- One leaf-mint beam on a near-neutral dark ground, dark first
- Every figure is a Diagram transcribing its adjacent copy, framed as an instrument
- Drawings never claim freshness: no live dot over authored arrays
- Graph imagery: estate-as-graph in the hero, the editorial figure and the ledgers
- The pack boundary is color, radius and mode together, and lands only on product marks
- Zero site-authored CSS; two-tone honesty ledger (live / Planned)

## Colors

Surveyor's mint on near-neutral dark, with the sibling packs held to product marks. The palette reads as a field notebook under a reading lamp: desaturated ground, one botanical highlight, hairline rules and glass panels.

### Primary
- **Estate Mint** (#9ddcad dark, #73bf88 light): the pack beam. Primary buttons, focus rings, the twin's stroke in the mark, the traveling marker on the hero lanes. Its text is always deepest green (#001f0a).
- **Brand Ink** (#bcecc7 dark, #1c6c3b light): mark and wordmark ink, a paler leaf than the beam.

### Secondary
- **Ray Cyan** (#7fdaf0): Nexus, inside its mark only.
- **Ray Gold** (#edc47d): AlphaLens, inside its mark only.
- **Ray Sky** (#9bd1ff): NaniSoft, inside its mark only.
- **The Prism Spectrum** (#ec88a0, #bc97e7, #73bf88, #6cb2eb, #e4965e): the Prism mark drawn as the full fan; the same stops power spectrum-ink heading tails.
- **Chart Runners** (#73bf88, #2dd4bf, #fbbf24, #a7ada8, #f87171 dark): the five chart colors, spent inside Diagrams and PulseGraph, never as decoration.

### Neutral
- **Ground** (#161917 dark, #ebeeeb light): the page, one continuous ground.
- **Ink** (#ebeeeb dark, #2b2f2c light): text at rest.
- **Muted Ink** (#c7ccc8 dark, #575c58 light): descriptions, captions, meta.
- **Wash** (#045026 dark, #d4f7dc light): accent fills; in dark a deep greenhouse shade of the beam, in light a pale mint cream.
- **Hairline** (#3f4440 dark, #dbdfdc light): all 1px structure and diagram strokes at rest.
- **Glass Card** (rgba(235, 238, 235, 0.07) dark, rgba(255, 255, 255, 0.72) light): card and instrument fills on the veil ladder.
- **Status**: alarm #f87171, grow #4ade80, hold #fcd34d in dark; #dc2626, #15803d, #f59e0b in light. The landing's ledger is deliberately two-tone: live ("Flagship, available today") and Planned.

### Named Rules
**The Twin Rule.** Color carries the mirror: the real is drawn in ink and hairlines, the living twin in mint and beam. A figure that cannot say which side it is on does not ship.
**The No-Freshness-Claims Rule.** A drawing never claims to be live. The hero instrument carries no status word; use-case status is stated once, in the ledger.
**The Mark-as-Boundary Rule.** Second-pack color exists only inside product marks in the products band. A second pack on any other region fails the build, because a pack boundary re-points color, corner radius and nearest dark mode together.

## Typography

**Display Font:** Inter (shipped inside the design system stylesheet; the site loads no font)
**Body Font:** Inter
**Label Font:** the system mono stack

**Character:** declarative and engineering-literal. Headings state the claim and hand the emphasis to spectrum ink; captions and mono labels sound like plate inscriptions on a technical drawing.

### Hierarchy
- **Display** (600, design system display scale): the hero claim, with the emphasized word or tail in spectrum ink.
- **Heading** (600, scale to 2.25rem): section headings, their semantic tail in spectrum ink.
- **Title** (600, 1rem): card titles, instrument headers, ledger labels.
- **Body** (400, 1rem): reading text at the 42rem measure; docs prose in the design system Prose. The em dash is deliberate site punctuation.
- **Label** (mono, 0.625rem, 0.1em tracking, uppercase): eyebrows, figure captions, ledger meta.

### Named Rules
**The Caption-Names-The-Drawing Rule.** Every figure carries a caption stating what it is, and the caption never overclaims: schematic, not photograph.

## Layout

One 72rem page column with reading text at the 42rem measure; sections breathe at 4rem and 6rem. The landing runs: hero with instrument, note grid, process rail, bare feature grid, status ledger, tall media band with the estate editorial, stack grid, product grid, closing call, with Ground01's aurora-and-particle atmosphere fixed behind everything at z-index -1 and the main column stacked at z-index 1. Reveal wraps the middle bands with staggered delays; the hero, the first note grid and the closing call stay still.

Docs run in the design system shell: a left rail with the section tree (Architecture is nine pages under one label heading with no index page), the article at the measure, a right rail outline, and the derived pager. Blog is site-composed rows in ListPanel items with dates and tag groups; the post page is the design system's. The site's own code holds almost no responsive logic (two sanctioned sm: utilities on the navbar CTA); all responsive behavior lives inside the blocks, tested at phone, tablet, laptop and desktop widths in both modes.

## Elevation & Depth

Layered glass on one ground. The four elevation tokens (rim, inner, contact, shade) compose the three shadow strengths; glass surfaces price themselves on the veil ladder (cards at 7% in dark, 72% in light, popover at 88%, navbar glass with a 12px blur). Instrument panels read as vitrines: hairline frames, glass fills, rim highlights. Nothing bespoke: no site-authored shadow, no extra alpha, and a reduced-transparency reader gets the flattened opaque fallbacks the sheet provides.

### Shadow Vocabulary (design system components only)
- **shadow-xs** (rim + contact): resting cards, inputs, instrument panels at rest.
- **shadow-sm** (rim + inner ring + contact + ambient shade): raised panels, the scrolled navbar.
- **shadow-md** (rim + inner ring + contact + wide shade): popovers, search dialog, menus.

### Named Rules
**The Vitrine Rule.** Panels that hold drawings are vitrines: glass fill, hairline frame, rim highlight. Depth never comes from a raw shadow value.
**The Token-Stroke Rule.** Diagram strokes and fills quote semantic tokens and veil rungs, so a figure repaints with the mode and never hard-codes a color.

## Shapes

The mint pack sits between the tight cyan grounds and the round gold one: 0.625rem base radius, with derived steps at 0.375rem, 0.875rem and 1.625rem. Corners round panels and instruments; product marks are fully rounded discs so a pack boundary's radius re-point moves nothing. Diagram geometry is the signature silhouette: hairline-bordered nodes on a drawn grid, solid edges for direct relations, one dashed edge reserved for the indirect relation, and a traveling lane marker for flow. Figures are server-rendered SVG with no script; their geometry is chosen to survive animation stopped.

## Components

### Buttons
- **Shape:** the 0.625rem pack radius.
- **Primary:** estate mint background, deepest green text; the hero's "Open the playground" and one honest door per section. The playground is always described as fully mocked.
- **Outline:** hairline border, ink text, transparent fill.
- **Hover / Focus:** token-priced; focus takes the mint ring.

### Cards / Containers
- **Corner Style:** 0.625rem.
- **Background:** glass card; wash fills for panels that state something.
- **Shadow Strategy:** token shadows only; the site authors none.
- **Border:** 1px hairline.
- **Internal Padding:** the design system spacing scale.

### Instrument Panel with Diagram (signature)
The framed vitrine every figure ships in: a neutral header row (no status word in the hero), a Diagram whose nodes repeat the adjacent copy verbatim, and a caption naming the drawing. The hero's instrument holds the twelve-node estate figure and a PulseGraph DAG with a traveling marker. Zero script; token-stroked; true in both modes and with animation stopped.

### Status Ledger
Two-tone honesty: live rows read "Flagship, available today", planned rows read "Planned". Status is stated once, in the ledger, and never repeated as badges. Use-case claims elsewhere on the page defer to it.

### Navigation
The design system navbar: sticky, transparent over the ground, glass on scroll. Atlas lockup left; Docs, Blog, About center; family menu with drawn marks, search dialog over a static index, mode toggle, and the playground CTA right. The hero carries no eyebrow: the name is already in the bar, and the hero is capped at four text elements.

### Docs Shell
Left rail tree, measured article, right rail outline, derived pager the site never hand-passes. Landmark labels declared ("Atlas documentation", "On this page", "Documentation pages").

### Named Rules
**The One View System Rule.** Prism is the only view system: every component renders through design system primitives styled by the pinned stylesheet, under the Zero-Custom-UI contract the ui:check gate enforces (no site stylesheet, inline style, hardcoded color, custom variable, styling dependency, font import or native control; imagery drawn or registered). What the catalogue lacks is requested upstream, never worked around.

## Do's and Don'ts

### Do:
- **Do** make every figure a Diagram that transcribes its adjacent copy, framed and captioned.
- **Do** keep drawings script-free and token-stroked so they survive both modes and stopped animation.
- **Do** state use-case status once, in the ledger, and let it govern the rest of the page.
- **Do** use the 0.625rem radius family and price all translucency on the veil ladder.
- **Do** keep the favicon's hex values quoting the mint dark tokens verbatim, and register them.
- **Do** let the blocks own responsiveness; the site's own code stays breakpoint-free.

### Don't:
- **Don't** author a stylesheet, inline style, hex value, custom variable or media query in site source.
- **Don't** put a green live dot or any freshness claim over an authored figure.
- **Don't** import raster images or inline JSX SVG in pages; imagery is drawn figures or registered assets.
- **Don't** place a second pack anywhere but a product mark; the pack map gate reads the built export.
- **Don't** add a native control, icon library, font import or styling dependency; the design system owns them.
- **Don't** repeat the hero panel's status in badges; the ledger already said it.

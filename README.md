# Atlas

> Model the real world digitally. First domain: a digital **twin** of the IT estate.

Part of the [NaniSoft](https://www.nanisoft.com) web platform — five sites, one design language ([Prism](https://prism.nanisoft.com)).

- **Live**: https://atlas.nanisoft.com (Custom Domain, auto-created on deploy)
- **Pack**: `mint` on the document element, and it does not change. Four other packs are on marks: the header's product switcher carries `sky`, `lavender`, `blush` and `peach`, and the products section carries the three its rows name. That is the whole five-pack layering, and `scripts/pack-map.json` is the map and the pack-boundary gate in `@nanisoft/prism-ui/gates` is the gate, checked in both light and dark mode
- **Stack**: Next 16 static export · fumadocs-mdx · pnpm · TypeScript strict · oxlint · Vitest (jsdom + Testing Library) · Cloudflare Workers
- **Chrome, every page and every section**: [@nanisoft/prism-ui](https://www.npmjs.com/package/@nanisoft/prism-ui) 0.10.2, pinned exactly. It brings [@nanisoft/prism-tokens](https://www.npmjs.com/package/@nanisoft/prism-tokens) at the exact version it was released against, so this repository declares one first-party dependency and cannot be handed a mismatched pair. There is no local component and no client runtime: every page is a server component, so the site ships no JavaScript of its own
- **Typeface**: none of this site's own. Prism ships Inter as three static woff2 files under the OFL and declares the `@font-face` rules in its own emitted sheet, so `--font-sans` resolves as published and nothing here loads, re-declares or repoints a family

## What ships

- **Landing** (`/`) — the thesis and the pipeline beside it in one panel, then five numbered sections: **the twin** (three points) · **the data path** (four stages, on a rail) · **what each stage is made of** (six capabilities) · **use cases** (three rows, statuses visible) · **the graph and one walk through it** (two hand-drawn figures) · **how it is built** (sixteen composed parts and four built in-house) · **built on Nexus** (three products, each row a mark in that product's own pack and a whole-row link), then the closing call to action.
- **Docs** (`/docs`) — the section index, and then Introduction, Concepts, Architecture, Guides, Reference over `content/docs/`. The rail is the design system's, and **Architecture is nine pages under one heading**: a section with no index page of its own, which the design system renders as a label rather than as a link.
- **Blog** (`/blog`) — the four launch posts over `content/blog/` (folder-per-post, required date, drafts excluded). The post is the design system's page; the list is this site's own, because the four blog lists in this family are four deliberate designs.
- **About** (`/about`) — the product's story: estates, then twin, then traversal, with the honesty devices stated.
- **Not found** — the design system's page: the code as the page's heading, the sentence under it, and three ways out.
- **`/sitemap.xml` and `/robots.txt`** — emitted from the same two content sources the pages are rendered from, so a drafted post or a deleted page leaves the sitemap by leaving the corpus.

Honesty devices are content, not chrome: use-case statuses (access traversal = available; blast radius and stale and unused access = planned) and the playground, always described as fully mocked. They are also *not* duplicated: each status is stated once, in the ledger that carries it, rather than in a strip above the fold that repeated it.

**The hero panel does not claim to be live.** It shows an architecture diagram over a node-and-edge list authored in `lib/content/landing.ts`, so its state is `neutral` and it prints no state word. The rail marker still travels. A green dot and the word `live` over a drawing of a mechanism is the one claim this page is not allowed to make.

## How it is put together

```
app/layout.tsx        the document: two theme attributes, the boot script, the chrome
app/page.tsx          the landing, composed from catalogue items and nothing else
app/globals.css       about 250 lines: the design system's own font family, the two
                      site-owned lists, and three layout classes for the hero
app/docs/…            the section index (this site's) and the document (the catalogue's)
app/blog/…            the blog list (this site's) and the blog post (the catalogue's)
lib/site.json         the ground, the default mode, the product directory
lib/site.ts           those facts, typed by the design system's pack vocabulary
lib/content/landing.ts every word of the landing, as data
lib/to-prism-tree.ts  fumadocs' page tree -> the documentation rail's three shapes
scripts/              the gates, the pack map, the parity expectations
test/                 the corpus from disk, the composition, the pack map, the
                      nine-page group, the absolute title, and the shape of the tree
```

Three things are worth knowing before changing anything here.

**A consumer cannot write a design-system utility class.** The emitted stylesheet is
compiled from the design system's own source, so a utility exists in it only if a
Prism component uses it. `mb-12` is safe; a utility Prism happens not to use would do
nothing and say nothing. Anything this site needs for itself goes in
`app/globals.css` as a site class.

**The site stylesheet owns almost nothing.** It must not declare the page ground, the
body ink, a focus outline or a hairline colour on a selector with no class in it, and
it must not carry a `:focus` rule at all: the design system's base layer is layered
and this sheet is not, so a bare-element rule here wins the cascade whatever the
cascade then does with it. That sentence is the reason the gate exists rather than the
gate's rule: the rule is the failure message, and when `pnpm check` is red the message
says which of these it was and why it matters.

**A pack boundary is not only colour.** It repoints the pack's corner radius beneath
it, and it wears the mode of the nearest ancestor carrying `.dark`, which is why a
server-rendered boundary has no mode class of its own. So a boundary belongs on a
fully rounded mark and nowhere else, and a page that put a second pack on a section
would be encoding its section index in its corner radius. The map says where two
regions may carry a second pack; the gate says the count and the identifiers, in both
modes, and a third region fails the build.

**The em dash is this site's punctuation, deliberately.** 221 of them are published
across the landing, About, the docs and the blog, and one of them is inside the
absolute page title, where `test/smoke.test.tsx` pins it as a byte rather than as
punctuation. They are not being kept out of inertia: the voice this site publishes in
is declarative and engineering-literal, an em dash is how that voice sets off a
consequence ("Atlas is one of three Nanisoft products on one platform — and the
platform has a factory behind it"), and no gate here can tell a habit from a
decision. If a reviewer wants them gone, that is a copy decision with a ledger entry
attached, not a lint rule.

**Two figures are hand-drawn, and they draw sentences rather than decorate.** Before
them the landing carried exactly one visual, the hero's pipeline, and everything below
the fold was a heading over a grid of words. `components/estate-graph-figure.tsx` and
`components/traversal-figure.tsx` draw two claims the page had no picture for: what the
estate turns into, and what the flagship question walks through. Each transcribes copy
the page already publishes, `InstrumentPanel01` owns the frame, and every colour in
both is a class in `app/globals.css` rather than a hex value, so a pack boundary
repaints them. Neither carries a `'use client'` line, so neither costs the page any
JavaScript.

## Develop

```bash
pnpm install
pnpm dev          # dev server
pnpm build        # static export to out/
pnpm lint         # oxlint
pnpm typecheck    # next typegen && tsc --noEmit
pnpm test         # vitest
pnpm check        # the docs-tree gate and the consumer gate kit; run it after pnpm build
```

`pnpm check` runs this site's own docs-tree gate and then `prism-gates`, the gate
kit in `@nanisoft/prism-ui/gates`. The laws themselves are not in this repository:
they are the failure messages of those gates, so a fix to one reaches this site in
one release and cannot be declined here. The four repositories of the family run
the same programs and hold none of the wording. What this site holds is its own
half, in `prism-gates.json` and the two files it names: its stylesheets, its pack
map and the reason each region exists, its region resolver, and its coverage
floors. Every one of those is data.

| gate | law |
| --- | --- |
| `check:docs-tree` | The nine-page single-section group, on its own, so a reviewer of the deepest documentation tree in this family is pointed at one command. This one is this site's, not the kit's. |
| `pin` | The design system is an exact version, and the token package is the component package's dependency rather than this site's. |
| `retired-line` | No trace of the retired component library, including no sentence still telling a later implementer to route imports through a file that was deleted. The lockfile is read as a graph. |
| `stylesheet-ownership` | This site's sheet owns no surface the design system owns, and no `color-mix()` takes a `var()` as an operand. |
| `token-read` | Every custom property this sheet reads is declared. A read that resolves to nothing is not a wrong colour; it is no declaration at all. |
| `links` | Every internal destination and every in-page fragment resolves to something this site emits. |
| `pack-boundary` | The pack map, from the built export, in both modes: the region set, the identifiers, a boundary on a mark and nowhere else, and each boundary's own pack resolved against the published token contract. |
| `runtime-token-read` | No token is read at runtime, because a read resolves once and a resolved value does not follow the cascade. |

The kit's limits, which it prints on every run: it reads text rather than resolving
a cascade, it reads the emitted export rather than a browser, and it cannot see an
attribute a runtime sets after paint.

The content-parity comparison was a one-time instrument for the migration sweep and is
gone with its baseline, which lived outside the repository and was destroyed at the
close of that sweep. What it did is worth recording, because it is the reason
`links` is the gate that survived: it read the built export through a document parser
rather than a digest of `content/`, so it saw the copy in `lib/content/landing.ts`
and in JSX, which a content-tree digest would have been blind to. It read the header
**and** the footer as chrome, because the copy it shipped with read only the header
while its own documentation claimed both. Every difference had to be declared in
`scripts/content-parity-expectations.json` with the reason it was a rendering change
and not a copy change, and a declaration that matched nothing was itself a finding.
The permanent successor asks a question that is true of every future build rather
than of one migration: does a reader who follows a link on this site arrive somewhere.

## Deploy

Push to `main` → GitHub Actions runs the checks and then, as a job that needs them,
`wrangler deploy` for the `atlas-site` Worker, authenticated with the org-level
`CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets. A push that fails its
checks cannot deploy, because the deploy job is never reached. `pnpm deploy` is the
local lane and needs wrangler auth. The Worker is assets-only: it serves `out/` and
runs no Worker script.

## Status

Live at https://atlas.nanisoft.com, serving a static export from the `atlas-site`
Worker. One use case is available today — access traversal; blast radius and stale and
unused access are planned, and the playground is a fully mocked in-browser tour rather
than a running platform. The pack is `mint` and the mode defaults to beam-dark.

The wayfinder map these sites were built from is retired, and it and its ticket numbers
are gone from this repository's documents. The standing references are `AGENTS.md`
(this repository's own scope, stack and commands), `prism-gates.json` (this site's
half of the cross-repository contract, which is data only) and this file. The laws
themselves are not a reference in this repository: they are the failure messages of
the gates in `@nanisoft/prism-ui/gates`, which this site installs by pinning that
package exactly.

## What the move cost, recorded so it is not rediscovered

Every one of these is a difference the content-parity ledger declares with a reason,
and the one catalogue gap this site hit is filed against the design system rather than
worked around:

- The eight off-the-shelf product names printed under the codenames have no slot on
  the design system's stack grid, which carries a name and a role. A real loss of
  published copy, reported rather than rewritten into the role line. Filed as
  [prism#114](https://github.com/NaniSoft/prism/issues/114): an optional second name on
  `StackPart`, counted per consumer rather than per string.
- The instrument panel's mode annotation is gone. A server cannot know the reader's
  mode, and the retired line read it in a client effect, so a panel that named the
  mode was a panel a light-mode reader was served a wrong claim about.
- The six feature cards' titles are no longer headings. A card is a surface rather
  than a section, and that is the design system's decision rather than this site's.
- The six points under the twin are a definition list now rather than three headings
  over a paragraph, and the three use-case names were never headings and still are not.
- The contents rail on every documentation page is a rail of **named** links. It used
  to be one anchor per heading with no accessible name at all.
- The two typography stacks this site vendored are gone, and so is the `next/font` load
  that replaced them. Prism named Inter and, for a while, shipped no file for it, so
  this site downloaded the family at build time and repointed `--font-sans` at the
  result. Prism 0.10.2 ships the typeface itself, so the arrangement now declared the
  same family twice, made every build depend on a download from Google, and put a
  second copy of the glyphs on the wire. Resolved upstream, not worked around here.

## What the recomposition cost

A later pass fixed what the composition above got wrong, and the changes worth
recording are the ones a future pass would be tempted to undo:

- The hero lost its eyebrow. `Hero01` draws an eyebrow as a small filled lozenge, and
  this site's was `nanisoft · atlas — Model the real world digitally`: fifty characters
  inside a pill narrower than the sentence is long. The words survive as the page's
  absolute title and About's lede. The hero now carries four text elements, which is
  its ceiling.
- The status strip under the hero is gone. It restated the three use-case statuses that
  the ledger states again further down, in the same words, and `playground → fully
  mocked` is carried by the closing band's footnote. Each status is now stated once.
- The band that held a single anchor under the ledger holds the two figures instead. It
  used to wrap a section's whole vertical rhythm around one link, with the playground
  printed for the third time on the page.
- The six cards between the data path and the use cases had no heading at all. They now
  have one, scoped to the four stages above them rather than to the platform, which is
  surveyed two bands later.
- The hero's title is set by `.site-hero h1` in `app/globals.css`, because `Hero01`
  offers no slot to scale one and the catalogue caps a section title at
  `sm:text-4xl`. It is a class rule on purpose: an unlayered rule beats prism's layered
  utility, and a bare `h1` rule would be a competing declaration the ownership gate
  rejects.
- The header's `actions` slot carries the playground. The Block has a right-hand slot
  for exactly one control, it was empty, and the playground was this site's single
  honest ask and its most-named destination.
- `app/icon.svg` was Prism's mark: a white beam refracted into blue inks on a navy
  ground, shipped as the favicon for a mint site on a near-black ground. It is now
  Atlas's own, three nodes and the edges among them, in values out of the mint pack's
  dark block.
- `published()` sorts the blog by date alone, and all four launch posts share one date,
  so the index and the whole previous/next trail were ordered by directory order. The
  tie is broken on the URL now.

Two defects were left standing, deliberately. The nav has no current-page mark: the
Block renders `aria-current="page"` from a `current` flag, and a header composed once in
the root layout of a static export has no request to read a path from. And the brand
lockup prints "Atlas" beside a switcher whose current entry is also "Atlas": the Block
draws the brand and the switcher unconditionally and offers no way to suppress either,
and suppressing the switcher would hide four of the five products from the one page
whose job is to say what they are.

# Visual + runtime gates

`pnpm build && pnpm visual` runs `test/visual/ui.spec.ts` against the static
export: no site stylesheet, no style attributes, no raw images, axe (critical +
serious), and screenshots per breakpoint (mobile/tablet/desktop/wide) that must
match `test/visual/__snapshots__/` baselines. The first local run creates the
baselines; review the PNGs before committing them. In CI this job is
non-blocking until the DS requests in UI-GOVERNANCE.md §4 land; `pnpm ui:check`
stays mandatory.

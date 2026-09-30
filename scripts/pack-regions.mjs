/**
 * Which region of this page a pack boundary belongs to.
 *
 * The law is in `@nanisoft/prism-ui/gates`: a boundary lands on a mark and
 * nowhere else, and a declared region set is the whole of what may carry a second
 * pack. What is here is the half only this site knows, and it is here rather than
 * in the kit because naming a region means knowing this site's own DOM. Three
 * other repositories run the same gate and each answers the same question about a
 * different page.
 *
 * Regions are named by the structure the catalogue publishes rather than by a
 * selector invented for the gate: a mark in a brand lockup is the lockup's, a mark
 * in the footer is the footer's, and a mark inside the block that draws the
 * platform rows is that band's. A mark in `<main>` that belongs to none of those
 * returns null rather than a guess, because a region the gate cannot name is a
 * region it cannot hold to `scripts/pack-map.json`, and a guess is worse than a
 * finding.
 *
 * Two of those rules are gone, and both of them were consequences of the same
 * change. The first named a mark in the header's switcher, and the switcher is a
 * menu now: its marks are rendered when a reader opens it, and a menu nobody has
 * opened is not in the static export this gate reads. The second named a mark in
 * `<main>` by the ordinal its own band printed above the heading, so this file held
 * `landing.05` and a page that dropped a section number, added one, or renumbered
 * silently renamed a region the gate was holding it to. The region is named by the
 * Block that draws the rows instead.
 *
 * Read by `pnpm check`. Nothing else imports it, and that is deliberate: this is
 * a declaration about one page, not a library.
 */
export function regionOf(element) {
  if (element.closest('header')) return 'header.brand';
  if (element.closest('footer')) return 'footer.brand';
  if (element.closest('main [data-slot="product-grid"]')) return 'landing.products';
  return null;
}

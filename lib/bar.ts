/**
 * The bar's own facts, as data.
 *
 * Everything the bar needs that is not the content tree: this site's own three
 * destinations, the family's five sites, and every sentence the bar's controls can
 * say. They are one module because they are one decision, and a bar whose control
 * names live in three files is a bar where a reader finds "Search" in one place and
 * "No matches." in another.
 *
 * **No pack chooser, and the omission is the decision.** `SiteNavbar` takes a colour
 * menu and this site does not pass one. A page's ground is stable for the life of the
 * page, and a control that let a reader repaint it would be offering them a page that
 * is not this one. Prism's own site is the site whose subject is its palettes, and it
 * is the one that gets the chooser.
 *
 * The mode toggle is here even though the ground is fixed, because the mode is the one
 * theme axis that is a reader's rather than the page's, and because the whole family
 * stores it under one key: a reader who chose dark on one NaniSoft site arrives in
 * dark on the other four.
 */
import type { SiteNavLink } from '@nanisoft/prism-ui/blocks/site-navbar';
import type { SwitcherProduct } from '@nanisoft/prism-ui/components/product-switcher';

import { PLAYGROUND_URL } from './links';
import { DEFAULT_MODE, GROUND_PACK, PRODUCTS, SITE_PRODUCT } from './site';

/** The product this bar belongs to, which is the same mark the footer draws. */
export const BAR_PRODUCT = SITE_PRODUCT;

/** The pack a reader who has never chosen gets. This site's own ground. */
export const BAR_DEFAULT_PACK = GROUND_PACK;

/** The mode a reader who has never chosen gets, from the constant the document uses. */
export const BAR_DEFAULT_MODE = DEFAULT_MODE;

/**
 * The one destination above the fold that leaves this site and is not the family.
 *
 * The playground is this site's single honest ask. It was named five times in the
 * landing's copy and used to be reachable from nowhere in the bar, because the Block
 * has one slot for a control the product owns and the slot was filled with a row of
 * five product names. It is published here rather than inline in the layout because
 * the word on it is a reader-facing string, and this site has exactly one place where
 * reader-facing strings about the bar are written.
 */
export const PLAYGROUND_ACTION = {
  label: 'Open the playground',
  href: PLAYGROUND_URL,
} as const;

/**
 * This site's own destinations, with the one the row carries another way.
 *
 * The three labels and destinations are the ones this chrome has always published,
 * unchanged. The order is the order a reader is most likely to want them: the
 * documentation is what a reader came for, the blog is what they read next, and About
 * is the one they read once.
 *
 * The fourth entry is the playground, and `mobileOnly` is the one reason it is here:
 * above `sm` the controls cluster carries it as the CTA, and below that width the
 * cluster cannot afford a fifth control, so the panel holds the place instead of
 * losing the destination. This is the arrangement the design system documents, and
 * 1.9 is the release that made it writable here: the published sheet emits the
 * `hidden sm:inline-flex` pair the arrangement needs, the panel's entry type carries
 * `newTab` so a held-back destination keeps the way the row opened it, and the
 * variant gate exempts exactly what the sheet publishes. Before that release the
 * cluster CTA overran the 390px bar and pushed the panel's own trigger off the
 * viewport, and neither half of this pair could be written; the destination rode the
 * navigation as a plain row link until the design system closed its own filings.
 *
 * The entry keeps `newTab` because the destination leaves the site, and the panel now
 * opens it the way the row would have.
 */
export const NAV: readonly SiteNavLink[] = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { ...PLAYGROUND_ACTION, newTab: true, mobileOnly: true },
];

/** The family's five sites, which is the set the bar's sites menu moves between. */
export const SITES: readonly SwitcherProduct[] = PRODUCTS;

/**
 * Every sentence the bar and the search dialog can say.
 *
 * A Block ships no copy, which is the right rule and it is why this object exists
 * rather than a default inside the package: the words a reader hears on this site are
 * this site's words. The two result labels are a pair because English inflects the noun
 * with the number, and the pair is where a site whose language does not put the number
 * first would supply its own order.
 */
export const COPY = {
  nav: 'Atlas',
  sites: 'Products',
  search: 'Search Atlas',
  searchHint: 'Type to search the documentation and every post.',
  searchClose: 'Close search',
  searchLoading: 'Loading the search index.',
  searchFailed: 'The search index could not be loaded.',
  searchEmpty: 'No matches.',
  searchOne: 'result.',
  searchOther: 'results.',
  toDark: 'Switch to dark mode',
  toLight: 'Switch to light mode',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
} as const;

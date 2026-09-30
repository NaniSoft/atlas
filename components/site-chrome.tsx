import type { ReactNode } from 'react';

import { CtaLink } from '@nanisoft/prism-ui/components/cta-link';
import { SiteFooter } from '@nanisoft/prism-ui/blocks/site-footer';
import { SiteNavbar } from '@nanisoft/prism-ui/blocks/site-navbar';

import {
  BAR_DEFAULT_MODE,
  BAR_DEFAULT_PACK,
  BAR_PRODUCT,
  COPY,
  FOOTER_SITE_LINKS,
  NAV,
  PLAYGROUND_ACTION,
  SITES,
} from '@/lib/bar';

/**
 * The chrome, in one place, and the reason it is not in the root layout.
 *
 * **A server render knows the route; a root layout does not.** This bar used to live
 * in `app/layout.tsx`, which is rendered once per route and is handed no pathname, so
 * none of the three destinations could ever be marked as the page the reader was on.
 * The Block offers two ways out of that and this one takes the first: the page sets
 * `current` on the link it is serving, the flag is a prop, and nothing became a client
 * component to get it. The second way is `currentPath`, which resolves the mark in the
 * browser and would have been the first runtime this site shipped. The comment that
 * used to sit above `NAV` in the layout explaining that the mark was impossible here
 * is gone rather than contradicted, and `test/server-only.test.ts` is the assertion that
 * it stayed free.
 *
 * **The bar is the design system's, and its client boundary is inside the package.**
 * Search, the menu of the family's five sites, the light and dark control and the panel
 * below the row's threshold are four pieces of reader state, and they are one client
 * island in `@nanisoft/prism-ui` rather than a line in this repository. So this site
 * still declares no `'use client'` anywhere, which is what lets the bar arrive without
 * costing this repository the property it is built around.
 *
 * **The family moved out of the navigation row and into a menu.** It used to be passed
 * as `products`, which put a five-name product family between the brand lockup and the
 * three pages a reader can actually read on this site, in brand ink, ahead of a
 * navigation in muted ink: the loudest thing in the bar was the one that leads
 * somewhere else. It is now a named menu at the right-hand end of the row, which is the
 * arrangement the design system settled on for all five sites.
 *
 * **The playground keeps its slot.** It is passed through `actions` rather than through
 * a prop, because a link to somewhere else is application state rather than a fact the
 * Block can be told about, and because the playground is this site's own ask rather
 * than one of the family's.
 *
 * `sticky` is the Block's default and is not restated: the landing is a long page and
 * the bar is how a reader leaves it, which is the reason the default exists.
 *
 * The footer keeps the brand lockup, the two grouped destinations and the legal line.
 */
export type SiteSection = '/docs' | '/blog' | '/about';

export function SiteChrome({
  current,
  children,
}: {
  /** The destination this page is serving, so the bar can mark the reader's place. */
  current?: SiteSection;
  children: ReactNode;
}): ReactNode {
  return (
    <>
      <SiteNavbar
        product={BAR_PRODUCT}
        defaultPack={BAR_DEFAULT_PACK}
        defaultMode={BAR_DEFAULT_MODE}
        nav={NAV.map((link) => ({ ...link, current: current === link.href }))}
        navLabel={COPY.nav}
        sites={SITES}
        currentSiteId={BAR_PRODUCT.id}
        sitesLabel={COPY.sites}
        search={{
          indexUrl: '/api/search',
          label: COPY.search,
          hint: COPY.searchHint,
          messages: {
            close: COPY.searchClose,
            loading: COPY.searchLoading,
            failed: COPY.searchFailed,
            empty: COPY.searchEmpty,
            one: COPY.searchOne,
            other: COPY.searchOther,
          },
        }}
        mode={{ lightLabel: COPY.toDark, darkLabel: COPY.toLight }}
        mobileLabels={{ open: COPY.menuOpen, close: COPY.menuClose }}
        actions={
          <CtaLink href={PLAYGROUND_ACTION.href} size="sm" newTab>
            {PLAYGROUND_ACTION.label}
          </CtaLink>
        }
      />
      <main className="site-main">{children}</main>
      <SiteFooter
        product={BAR_PRODUCT}
        columns={[
          // The same three destinations the bar carries, read from the same list rather
          // than written twice. This site holds itself to one name per door, and a
          // second list of the same three hrefs is where a fourth name for `/docs`
          // would come from.
          { title: 'Atlas', links: [...FOOTER_SITE_LINKS] },
          {
            title: 'See it run',
            links: [
              { label: PLAYGROUND_ACTION.label, href: PLAYGROUND_ACTION.href, newTab: true },
              { label: 'Access traversal', href: '/docs/guides/access-traversal' },
              { label: 'The integration ledger', href: '/docs/reference/integration-ledger' },
            ],
          },
        ]}
        legal={'\u00a9 NaniSoft'}
      />
    </>
  );
}

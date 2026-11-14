import type { ReactNode } from 'react';

import { SiteFooter } from '@nanisoft/prism-ui/blocks/site-footer';
import { SiteNavbar } from '@nanisoft/prism-ui/blocks/site-navbar';
import { AtlasMark, AlphaLensMark, NaniSoftMark, NexusMark, PrismMark } from '@nanisoft/prism-ui/components/product-marks';
import { DSStack } from '@nanisoft/prism-ui/components/ds-stack';
import { Text } from '@nanisoft/prism-ui/components/typography';

import {
  BAR_DEFAULT_MODE,
  BAR_DEFAULT_PACK,
  BAR_PRODUCT,
  COPY,
  NAV,
  SITES,
} from '@/lib/bar';

/**
 * The chrome, in one place. The bar is the design system's (data and copy
 * only), the product mark is the design system's `AtlasMark`, and the frame
 * carries no classes of its own.
 *
 * A server render knows the route; a root layout does not, which is why every
 * page renders the chrome with the route it is serving so the bar can mark the
 * reader's place by prop rather than by a client boundary.
 */
export type SiteSection = '/docs' | '/blog' | '/about';

/*
 * The product, as the chrome draws it: the same three facts the bar and the
 * footer have always read, plus the drawing — the design system's own Atlas
 * mark, drawn in the sized slot the chrome owns, so a reader meets one sign
 * three times rather than a disc twice and a drawing once.
 */
const PRODUCT = { ...BAR_PRODUCT, mark: <AtlasMark /> };

/** The family's marks, as the bar's sites menu draws them. */
const SITE_MARKS: Record<string, ReactNode> = {
  www: <NaniSoftMark />,
  nexus: <NexusMark />,
  atlas: <AtlasMark />,
  alphalens: <AlphaLensMark />,
  prism: <PrismMark />,
};

/** The family, with each member's drawn mark attached to its directory entry. */
const SITES_WITH_MARKS = SITES.map((site) => ({ ...site, mark: SITE_MARKS[site.id] }));

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
        product={PRODUCT}
        defaultPack={BAR_DEFAULT_PACK}
        defaultMode={BAR_DEFAULT_MODE}
        nav={NAV.map((link) => ({ ...link, current: current === link.href }))}
        navLabel={COPY.nav}
        sites={SITES_WITH_MARKS}
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
      />
      <main data-slot="site-main">{children}</main>
      <SiteFooter
        product={PRODUCT}
        about={
          <DSStack gap="xs">
            <Text>Model the real world digitally.</Text>
            <Text tone="muted" size="sm">
              Atlas models the real world digitally: living representations of systems,
              assets and operations.
            </Text>
          </DSStack>
        }
        columns={[
          {
            title: 'This site',
            links: [
              { label: 'Landing', href: '/' },
              /* The bar's destinations as they are, with each link's own new-tab
                 decision: the playground is the one that leaves the site, and it
                 rides the navigation now, so a separate entry here would be the
                 same destination twice in one column. */
              ...NAV.map((link) => ({ label: link.label, href: link.href, newTab: link.newTab })),
            ],
          },
          {
            title: 'The family',
            links: SITES.filter((site) => site.id !== BAR_PRODUCT.id).map((site) => ({
              label: site.name,
              href: site.href,
              newTab: true,
            })),
          },
        ]}
        legal={'© NaniSoft'}
      />
    </>
  );
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The one stylesheet. Every token, every utility and every base rule on this site
// arrives in this one import: the design system compiles its own source into it, and
// a consumer adds its own sheet after it and nothing else.
import '@nanisoft/prism-ui/styles.css';
import './globals.css';

import { CtaLink } from '@nanisoft/prism-ui/components/cta-link';
import { SiteFooter } from '@nanisoft/prism-ui/blocks/site-footer';
import { SiteHeader } from '@nanisoft/prism-ui/blocks/site-header';
import { PrismThemeScript } from '@nanisoft/prism-ui/provider';

import { PLAYGROUND_URL } from '@/lib/links';
import { DEFAULT_MODE, GROUND_PACK, PRODUCTS, SITE_PRODUCT, THEME_ATTRIBUTES } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL('https://atlas.nanisoft.com'),
  title: {
    default: 'Atlas — Model the real world digitally',
    template: '%s · Atlas',
  },
  description: 'The Digital Twin Platform — living models of real systems.',
  openGraph: {
    type: 'website',
    siteName: 'Atlas',
    locale: 'en',
    // No per-route image is declared, so a share of any route falls back to this one.
    // It is the site's own mark rather than a generated card, which is a deliberate
    // trade: a static export has no image pipeline, and a mark that is the product's
    // own identity beats a card nobody reviewed.
    images: [{ url: '/icon.svg', width: 32, height: 32, alt: 'Atlas' }],
  },
  twitter: {
    card: 'summary',
  },
};

/**
 * Site nav — lean, only destinations this site actually substantiates.
 *
 * The labels and the destinations are the ones the old chrome published, unchanged.
 * `navLabel` is required by the Block and is the name this site's own navigation
 * takes, because a site that files a documentation section and a blog wants those two
 * regions named rather than lumped together under a word about the whole site.
 *
 * **No link here declares `current`.** The Block renders `aria-current="page"` from
 * it, and it is the one piece of navigation state this site would like and cannot
 * have: the header is composed once in the root layout, a static export has no
 * request to read a path from, and the one API that would answer it
 * (`headers()`) does not exist under `output: export`. So a reader on a docs page
 * gets no current-page mark in the chrome. That is a property of the stack rather
 * than a choice, and it is recorded here rather than worked around with a client
 * effect, because this site ships no JavaScript.
 */
const NAV = [
  { label: 'Docs', href: '/docs' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
] as const;

/** The columns the footer has always published, as the Block's own shape. */
const FOOTER_COLUMNS = [
  {
    title: 'Atlas',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Blog', href: '/blog' },
      { label: 'About', href: '/about' },
    ],
  },
  {
    title: 'See it run',
    links: [
      { label: 'Open the playground', href: 'https://playground.nanisoft.com', newTab: true },
      { label: 'Access traversal', href: '/docs/guides/access-traversal' },
      { label: 'The integration ledger', href: '/docs/reference/integration-ledger' },
    ],
  },
] as const;

/**
 * The line at the foot of the footer.
 *
 * It was published here before the move and it is published here now, unchanged and
 * byte for byte, because the design system's footer carries a slot for exactly this
 * and a footer that silently dropped its own legal line would be a rendering-layer
 * change that reads as a copy change. It is a string rather than a year plus a
 * string because the retired line never printed one and inventing one is a content
 * decision this migration is not making.
 */
const FOOTER_LEGAL = '\u00a9 NaniSoft';

/**
 * The document: the two theme attributes, one blocking script, the chrome, the page.
 *
 * **No provider, no client runtime, no baked stylesheet, and no font loader.** The old
 * layout mounted a theme provider, imported a registry for a component library that no
 * longer exists, and loaded 126 KB of generated variables to define the sixty custom
 * properties the site's own CSS read. The theme is now two attributes on the document
 * element and a blocking script that applies a stored choice to them before first
 * paint, which is the arrangement the design system documents as the default and the
 * one the whole page is built for: a server render, no client JavaScript, and a page
 * that is correct with scripting disabled.
 *
 * **This site loads no font file at all.** It used to: `next/font/google` was
 * downloading Inter at build time and `app/globals.css` was repointing `--font-sans`
 * at the result, on the stated ground that prism shipped no typeface. Prism 0.10.2
 * ships one — `dist/fonts/inter-latin-{400,500,600}.woff2` under the OFL, with three
 * `@font-face` rules in its emitted sheet — so that arrangement declared the same
 * family twice, made the build depend on a download from Google, and put a second
 * copy of every glyph on the wire. The design system owns the typeface now, and owns
 * it from its own stylesheet, which is the whole arrangement the migration was for.
 *
 * The switcher moves between the five members of the company's product set, so all
 * five published packs are on every page rather than on one page of one site. Four of
 * the five are not this site's ground. The header's navigation and the switcher are
 * two `nav` landmarks for the reason the design system gives: a reader who navigates
 * by landmark needs two regions rather than one region with two lists in it.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning {...THEME_ATTRIBUTES}>
      <head>
        {/* Before paint, on the same attributes the server rendered: a stored choice
            is applied and a stored value that no longer parses is left in place, so
            nothing a reader chose is ever cleared by this site. */}
        <PrismThemeScript defaultPack={GROUND_PACK} defaultMode={DEFAULT_MODE} />
      </head>
      <body>
        <SiteHeader
          product={SITE_PRODUCT}
          products={PRODUCTS}
          nav={NAV}
          navLabel="Atlas"
          productsLabel="Products"
          /* The playground is this site's single honest ask, and the Block has a slot
             for exactly one control at the right-hand end of the bar. The slot was
             empty, so the bar was a row of five product names and three page names
             left-packed against a quarter of the viewport with nothing in it. This is
             the one destination that was named five times in the landing's copy and
             reachable from nowhere above the fold. */
          actions={
            <CtaLink href={PLAYGROUND_URL} size="sm" newTab>
              Open the playground
            </CtaLink>
          }
        />
        <main className="site-main">{children}</main>
        <SiteFooter product={SITE_PRODUCT} columns={FOOTER_COLUMNS} legal={FOOTER_LEGAL} />
      </body>
    </html>
  );
}

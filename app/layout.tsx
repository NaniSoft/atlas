import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The one stylesheet. Every token, every utility and every base rule on this site
// arrives in this one import: the design system compiles its own source into it, and
// a consumer adds its own sheet after it and nothing else.
import '@nanisoft/prism-ui/styles.css';
import './globals.css';

import { SiteFooter } from '@nanisoft/prism-ui/blocks/site-footer';
import { SiteHeader } from '@nanisoft/prism-ui/blocks/site-header';
import { PrismThemeScript } from '@nanisoft/prism-ui/provider';

import { DEFAULT_MODE, GROUND_PACK, PRODUCTS, SITE_PRODUCT, THEME_ATTRIBUTES } from '@/lib/site';

export const metadata: Metadata = {
  title: {
    default: 'Atlas — Model the real world digitally',
    template: '%s · Atlas',
  },
  description: 'The Digital Twin Platform — living models of real systems.',
};

/**
 * The design system's own first family, and the only font file this site loads.
 *
 * `--font-sans` in prism's emitted sheet reads `Inter, ui-sans-serif, system-ui, ...`.
 * Naming a family is not shipping it: 0.7.0 carries no font file, so a site that
 * loads nothing renders in the platform's UI face, which is the one face a design
 * system never means by its first choice. The variable is applied to the document
 * element and `app/globals.css` puts it in front of prism's own fallback list, which
 * is repeated there verbatim so the design system's intent is unchanged and only its
 * first entry becomes real.
 *
 * The migration dropped this site's Archivo and JetBrains Mono and let the type fall
 * back. That was not in the ticket, and it is the most visible change the migration
 * made. The typeface belongs to the design system and lands with it (the open item is
 * that `@nanisoft/prism-ui` should ship one), so a site supplies the file the token
 * already names rather than choosing its own typeface.
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * The document element's class: the font file's variable and the mode, together.
 *
 * `themeAttributes` returns a `className` for the mode and the font loader returns one
 * for the variable, and only one `className` prop exists, so the two are joined here
 * rather than spread one over the other. Spreading the theme last, which is the
 * obvious way to write it, silently drops the font: the page still builds, the
 * stylesheet still resolves, and every page renders in the platform's UI face with
 * nothing in the build saying so. `test/smoke.test.tsx` asserts both halves are here.
 */
const DOCUMENT_CLASS = [inter.variable, THEME_ATTRIBUTES.className].filter(Boolean).join(' ');

/**
 * Site nav — lean, only destinations this site actually substantiates.
 *
 * The labels and the destinations are the ones the old chrome published, unchanged.
 * `navLabel` is required by the Block and is the name this site's own navigation
 * takes, because a site that files a documentation section and a blog wants those two
 * regions named rather than lumped together under a word about the whole site.
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
 * **No provider, no client runtime, no baked stylesheet.** The old layout mounted a
 * theme provider, imported a registry for a component library that no longer exists,
 * and loaded 126 KB of generated variables to define the sixty custom properties the
 * site's own CSS read. The theme is now two attributes on the document element and a
 * blocking script that applies a stored choice to them before first paint, which is
 * the arrangement the design system documents as the default and the one the whole
 * page is built for: a server render, no client JavaScript, and a page that is
 * correct with scripting disabled.
 *
 * The switcher moves between the five members of the company's product set, so all
 * five published packs are on every page rather than on one page of one site. Four of
 * the five are not this site's ground. The header's navigation and the switcher are
 * two `nav` landmarks for the reason the design system gives: a reader who navigates
 * by landmark needs two regions rather than one region with two lists in it.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning {...THEME_ATTRIBUTES} className={DOCUMENT_CLASS}>
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
        />
        <main className="site-main">{children}</main>
        <SiteFooter product={SITE_PRODUCT} columns={FOOTER_COLUMNS} legal={FOOTER_LEGAL} />
      </body>
    </html>
  );
}

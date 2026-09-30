import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// The one stylesheet. Every token, every utility and every base rule on this site
// arrives in this one import: the design system compiles its own source into it, and
// a consumer adds its own sheet after it and nothing else.
import '@nanisoft/prism-ui/styles.css';
import './globals.css';

import { PrismThemeScript } from '@nanisoft/prism-ui/provider';

import { DEFAULT_MODE, GROUND_PACK, THEME_ATTRIBUTES } from '@/lib/site';

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
 * The document, and nothing else: the two theme attributes, one blocking script, the
 * page.
 *
 * **The chrome left this file.** It is in `components/site-chrome.tsx` now, and each
 * page renders it against the page it is serving, because a layout is rendered once
 * per route and is handed no pathname, so a bar that lives here can never mark the
 * page a reader is on. That was the one thing this layout could not do and the reason
 * it is worth a file per page: a server render is handed the route it is rendering, so
 * the current link is a prop rather than something the browser has to be asked for.
 *
 * The old comment here claimed the current-page mark was impossible on this site
 * because `headers()` does not exist under `output: export`. That was true and it was
 * the wrong conclusion: the API that cannot answer is the one that reads the request,
 * and a server render never needed it. Composing the bar per page is what removed the
 * question, so the claim is gone rather than left standing next to its own refutation.
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
 * at the result, on the stated ground that prism shipped no typeface. Prism ships one —
 * `dist/fonts/inter-latin-{400,500,600}.woff2` under the OFL, with three `@font-face`
 * rules in its emitted sheet — so that arrangement declared the same family twice,
 * made the build depend on a download from Google, and put a second copy of every
 * glyph on the wire. The design system owns the typeface now, and owns it from its
 * own stylesheet, which is the whole arrangement the migration was for.
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
      <body>{children}</body>
    </html>
  );
}

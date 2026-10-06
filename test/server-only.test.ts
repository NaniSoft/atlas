import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * This repository ships no client code, and the two laws that used to need prose to
 * hold it are enforced by that fact rather than by prose.
 *
 * The canvas law said a runtime token read must not carry a hard-coded fallback,
 * because a read that cannot fail hides its own failure. The reveal law said a
 * CSS-authored hidden state must be able to dismiss itself. Both were laws about
 * client code, and this repository has none: the landing is a server component, the
 * pages are server components, and the theme is two attributes on the document
 * element plus a blocking script the design system ships.
 *
 * So the enforceable version of both laws is the shape of the tree, and this file is
 * that assertion. A clause earns a gate when its violation is silent, and a
 * `'use client'` line at the top of a component is exactly that: nothing throws, the
 * page still builds, and the reader gets a runtime that resolves colours once at
 * mount and paints them on a dark page in light values. The retired line had both
 * laws written down in a prose contract mirrored in four repositories and violated
 * the reveal one on every page of the landing, because prose cannot fail. Both laws
 * are now the failure messages of gates in `@nanisoft/prism-ui/gates`; this file is
 * the half only this repository can assert, which is that its tree is empty of the
 * client code the laws are about.
 *
 * If a future change needs client code on this site, this test is where the argument
 * happens, and the answer is a question rather than a deletion: what does the client
 * need that a server render cannot give it?
 */
const ROOT = path.resolve(__dirname, '..');
const SOURCE = /\.(ts|tsx)$/;

/** Directories that hold the site's own source. A list, so a new one is a decision. */
const ROOTS = ['app', 'components', 'lib', 'test'];

/** The two configuration files at the root, which are source too. */
const ROOT_FILES = ['next.config.ts', 'vitest.config.ts'];

function sourceFiles(dir: string, found: string[] = []): string[] {
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) sourceFiles(full, found);
    else if (SOURCE.test(entry.name)) found.push(full);
  }
  return found;
}

const files = [
  ...ROOTS.flatMap((root) => sourceFiles(path.join(ROOT, root))),
  ...ROOT_FILES.map((file) => path.join(ROOT, file)),
].filter((file) => !file.includes(`${path.sep}test${path.sep}`));

describe('the site has no client code', () => {
  it('reads the whole source tree, so this is not a pass over nothing', () => {
    // Every source file the repository owns is in this list, which is the assertion
    // that matters: a file that is not in the list is a file no law here reaches.
    expect(files.map((file) => path.relative(ROOT, file).split(path.sep).join('/')).sort()).toEqual([
      'app/about/page.tsx',
      'app/api/search/route.ts',
      'app/blog/[[...slug]]/page.tsx',
      'app/docs/[[...slug]]/page.tsx',
      'app/layout.tsx',
      'app/not-found.tsx',
      'app/page.tsx',
      'app/robots.ts',
      'app/sitemap.ts',
      'components/doc-article.tsx',
      'components/estate-graph-figure.tsx',
      'components/section-index.tsx',
      'components/site-chrome.tsx',
      'components/traversal-figure.tsx',
      'lib/bar.ts',
      'lib/content/landing.ts',
      'lib/links.ts',
      'lib/mdx-components.tsx',
      'lib/post-date.ts',
      'lib/site.ts',
      'lib/source.ts',
      'lib/to-prism-tree.ts',
      'next.config.ts',
      'vitest.config.ts',
    ]);
  });

  it('carries no use client directive', () => {
    // The bar is a server component with one client island inside the package: the
    // sites menu, the search dialog, the mode control and the panel below the row's
    // threshold are four pieces of reader state, and they are client components in
    // `@nanisoft/prism-ui` rather than a boundary drawn here. The chrome moved out of
    // the root layout so the bar could mark the page a reader is on, and that cost this
    // repository nothing: a server render is handed the route it is rendering, so
    // `aria-current` is a prop rather than something the browser has to be asked for.
    const offenders = files.filter((file) => /^\s*['"]use client['"]/m.test(readFileSync(file, 'utf8')));
    expect(offenders, `a client boundary in ${offenders.join(', ')}`).toEqual([]);
  });

  it('reads no token at runtime, and takes no colour from a computed style', () => {
    // The runtime token-read law, as an assertion about the whole tree rather than
    // about a canvas. The law's wording, and the retired line's own names, are in the
    // gate kit: its `runtime-token-read` gate scans this same tree for every one of
    // them. What this test is for is the file list above, which is the half a gate
    // cannot assert. A test that spells the law out is a second copy of it, and four
    // copies of a sentence is the failure this programme exists to end.
    //
    // The one name that stays here is `usePrismTheme`, because it is a live export of
    // the current design system rather than a name from the retired line: a consumer
    // that imported it would have a client boundary, and that is a fact about this
    // repository's structure rather than about the law.
    const pattern = /getPropertyValue|getComputedStyle|usePrismTheme/;
    const offenders = files.filter((file) => pattern.test(readFileSync(file, 'utf8')));
    expect(offenders, `a runtime token read in ${offenders.join(', ')}`).toEqual([]);
  });

  it('authors no hidden state, so the reveal law has nothing to govern', () => {
    // The reveal law, as an assertion: a CSS-authored hidden state needs an escapable
    // condition, and the cheapest way to be sure there is none is that the stylesheet
    // declares no opacity or visibility of zero at all and no keyframes.
    const css = readFileSync(path.join(ROOT, 'app', 'globals.css'), 'utf8');
    expect(css).not.toMatch(/opacity:\s*0\b/);
    expect(css).not.toMatch(/visibility:\s*hidden/);
    expect(css).not.toMatch(/data-reveal|\.is-in/);
    expect(css).not.toMatch(/@keyframes/);
  });

  it('imports the design system stylesheet exactly once, in the root layout', () => {
    // One stylesheet. A consumer that imported a second one would change the cascade,
    // and the design system carries every token, every utility and every base rule in
    // this one file.
    const importers = files.filter((file) => /@nanisoft\/prism-ui\/styles\.css/.test(readFileSync(file, 'utf8')));
    expect(importers.map((file) => path.relative(ROOT, file).split(path.sep).join('/'))).toEqual([
      'app/layout.tsx',
    ]);
  });

  it('mounts no theme provider, and imports nothing from the package root barrel', () => {
    // The root barrel is the one import shape the retired line's own instructions
    // forbade, because it pulls the SSR extractor meant for build scripts. The new
    // line's every subpath is explicit, and this is the assertion that the root
    // barrel stays unused by app code.
    const offenders = files.filter((file) =>
      /from\s+'@nanisoft\/prism-ui'/.test(readFileSync(file, 'utf8')),
    );
    expect(offenders, `a root-barrel import in ${offenders.join(', ')}`).toEqual([]);
  });

  it('carries no client boundary, because the file that existed only to cross one is gone', () => {
    // The retired line's `components/prism-client.tsx` existed because a competitor
    // shipped `'use client'` and a namespace could not cross an RSC boundary. The
    // design system's items are server components, so there is nothing to cross: the
    // file is deleted rather than reimplemented, and the prose that told a later
    // implementer to route imports through it is rewritten in the same change.
    expect(existsSync(path.join(ROOT, 'components', 'prism-client.tsx'))).toBe(false);
    expect(existsSync(path.join(ROOT, 'components', 'landing'))).toBe(false);
    expect(existsSync(path.join(ROOT, 'lib', 'theme.ts'))).toBe(false);
  });
});

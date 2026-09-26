// Headless MDX component mapping (fumadocs-core headless: we own the HTML).
// Prose elements are plain HTML styled by `.site-prose`; Atlas maps no custom
// components today, so the map is empty — the seam stays because the docs page
// passes it and a future mapping (figures, callouts) should not need a rewrite.

import type { ComponentType } from 'react';

export interface MdxScope {
  /** The page's url with the leading slash, e.g. `docs/concepts/the-twin`. */
  itemKey: string;
}

type MdxComponentMap = Record<string, ComponentType<Record<string, unknown>>>;

/** Merge the page scope into a per-page component map. */
export function getMdxComponents(_scope: MdxScope, extra?: MdxComponentMap): MdxComponentMap {
  return { ...extra };
}

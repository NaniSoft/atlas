// Headless MDX component mapping (fumadocs-core headless: we own the HTML).
// Prose elements are plain HTML styled by the design system's stylesheet; this
// site's only mapping is the one attribute the stylesheet cannot declare.

import type { ComponentType } from 'react';

export interface MdxScope {
  /** The page's url with the leading slash, e.g. `docs/concepts/the-twin`. */
  itemKey: string;
}

type MdxComponentMap = Record<string, ComponentType<Record<string, unknown>>>;

/**
 * A plain `<table>` is the scroll container `Prose` gives a wide ledger, and a
 * scroll container has to be a tab stop so a keyboard reader can pan it. This
 * is the one mapping the seam exists for: `tabIndex` is an attribute, so no
 * stylesheet can add it, and the docs route already hands this map to MDX.
 * No styling is introduced, so the table still takes every treatment from the
 * design system's `Prose` rules.
 */
const ScrollableTable: ComponentType<Record<string, unknown>> = (props) => (
  <table {...props} tabIndex={0} />
);

/** Merge the page scope into a per-page component map. */
export function getMdxComponents(_scope: MdxScope, extra?: MdxComponentMap): MdxComponentMap {
  return { table: ScrollableTable, ...extra };
}

// The app-side `toPrismTree()` adapter: fumadocs' page tree → prism-ui's
// DocsNavEntry[]. prism-ui never sees a fumadocs type.

import type { DocsNavEntry } from '@nanisoft/prism-ui/pages';
import type { Folder, Item, Node, Separator } from 'fumadocs-core/page-tree';

function nodeName(node: Item | Folder | Separator): string {
  const { name } = node;
  if (typeof name === 'string') return name;
  if (typeof name === 'number') return String(name);
  return '';
}

/**
 * The plain text of a heading, for the contents rail.
 *
 * fumadocs flattens a heading into an array of strings and inline elements rather
 * than into one string, so a consumer that asks for a string gets nothing at all.
 * That is not a hypothetical: this repository's contents rail shipped for its
 * whole life as one anchor per heading with no accessible name, because this
 * function's predecessor kept the value only when it was already a string and
 * produced an empty label every other time. A rail of unnamed links is a list a
 * keyboard reader can walk into and not out of, so the flattening is here, and it
 * is a join rather than a drop: an element contributes the text it wraps, so a
 * heading with inline code in it keeps its words.
 */
export function toPlainText(node: unknown): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(toPlainText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return props ? toPlainText(props.children) : '';
  }
  return '';
}

/**
 * Flatten a section's page tree into the documentation rail's own three shapes.
 *
 * A folder with an index page is a destination and carries its own `href`; a folder
 * with none is a **label**, and the design system renders it as a `span` with no
 * `href` rather than as an anchor. That is the whole reason the type spells the
 * absence out: an anchor a reader can focus and not follow is a broken link, and
 * this repository carries one of those for every section of its documentation,
 * because its four folders hold no `index.mdx`. An earlier version of this file
 * wrote `url: ''` for them and the site's own stylesheet then styled the resulting
 * anchor back into a label, which is a rule that exists only to repair a defect a
 * type can now prevent.
 *
 * A separator is the third shape and is a rule between entries, not an entry. The
 * four folders of this corpus are all titled, so nothing here emits one today, and
 * the case is handled because a tree that grows a rule should not need this file
 * rewritten to render it.
 */
export function toPrismTree(children: Node[]): DocsNavEntry[] {
  const entries: DocsNavEntry[] = [];
  for (const node of children) {
    if (node.type === 'separator') {
      entries.push({ type: 'divider', title: nodeName(node) });
      continue;
    }
    if (node.type === 'folder') {
      const items = toPrismTree(node.children);
      const index = node.index?.url;
      entries.push(
        index === undefined
          ? { type: 'group', title: nodeName(node), items }
          : { type: 'group', title: nodeName(node), href: index, items },
      );
      continue;
    }
    entries.push({ type: 'page', title: nodeName(node), href: node.url });
  }
  return entries;
}

/**
 * The headings inside a document, in document order, for the contents rail.
 *
 * The whole outline or none: the design system's own documentation says a partial
 * one is a contents list that lies about the page, and this corpus has pages whose
 * h3s belong under an h2 the depth filter would have dropped. So the filter is the
 * document's own rule rather than this site's, and every heading the pipeline found
 * is passed on.
 */
export function toPrismToc(
  toc: ReadonlyArray<{ title: unknown; url: string }> | undefined,
): DocsNavEntry[] | undefined {
  if (!toc || toc.length === 0) return undefined;
  return toc.map((entry) => ({ type: 'page', title: toPlainText(entry.title), href: entry.url }));
}

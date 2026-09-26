// Content sources — the prism recipe's per-section loaders, reduced to the two
// collections a product site needs (docs + blog).
//
// The fumadocs-mdx Macro API is compile-time: `defineDocs`/`defineCollections`
// may only appear at top level in this module with literal `dir`s, and the
// module must not re-export the macro. Frontmatter = fumadocs defaults plus the
// blog's date/tags/draft.

import { defineCollections, defineDocs } from 'fumadocs-mdx/macro';
import { loader } from 'fumadocs-core/source';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

/** The Atlas docs corpus (`content/docs/<section>/<slug>.mdx`). */
export const docs = defineDocs({
  dir: 'content/docs',
});

/** Folder-per-post blog: required ISO date, display-only tags, drafts excluded. */
export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: pageSchema.extend({
    date: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const docsSource = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
});

export const blogSource = loader({
  baseUrl: '/blog',
  source: blog.toFumadocsSource(),
});

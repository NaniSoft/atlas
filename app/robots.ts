// The robots file, and the sitemap pointer.
//
// There was no robots file, so the only instructions a crawler had were the defaults:
// everything is allowed and nothing is pointed at. The defaults are right here, and
// the second half is the part that was missing — a crawler that has not read a sitemap
// has no way to learn that this site has nineteen documentation pages under four
// section folders.

import type { MetadataRoute } from 'next';

/**
 * Both metadata routes need this, and neither needs it for a reason that has anything
 * to do with robots.
 *
 * A route handler is dynamic by default, and `output: 'export'` refuses to emit a
 * dynamic route: it would have to ask a server for the answer, and there is no server.
 * `force-static` is the declaration that the answer is computed at build time, which
 * it is — there is no request in it, no header and no cookie.
 */
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://atlas.nanisoft.com/sitemap.xml',
  };
}

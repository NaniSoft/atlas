import { createMDX } from 'fumadocs-mdx/next';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Static export → Cloudflare Workers Static Assets (the platform's stack
  // precedent, proven by prism.nanisoft.com).
  output: 'export',
  images: {
    unoptimized: true,
  },
};

// fumadocs-mdx's Macro API integration — compiles content collections and
// transforms lib/source.ts's defineDocs/defineCollections calls.
// Call, not wrap: createMDX() returns the config decorator. `createMDX(nextConfig)`
// would hand Next a function that spreads the 22-char phase string into the
// config (numeric-key soup, `output` dropped) — found on prism's site.
export default createMDX()(nextConfig);

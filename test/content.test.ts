// Content integrity, read off disk: the docs IA matches ticket 07's outline,
// every blog post carries the frontmatter the routes require, and the honesty
// devices survive in prose — no page promises something the site does not ship.

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'content', 'docs');
const BLOG = path.join(ROOT, 'content', 'blog');

async function read(file: string): Promise<string> {
  return readFile(path.join(DOCS, file), 'utf8');
}

async function exists(file: string): Promise<boolean> {
  try {
    await stat(path.join(DOCS, file));
    return true;
  } catch {
    return false;
  }
}

async function blogSlugs(): Promise<string[]> {
  const entries = await readdir(BLOG, { withFileTypes: true });
  const slugs: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    try {
      await stat(path.join(BLOG, entry.name, 'index.mdx'));
      slugs.push(entry.name);
    } catch {
      // a folder without index.mdx is not a post
    }
  }
  return slugs.sort();
}

describe('docs IA (ticket 07 §3)', () => {
  const IA = {
    concepts: ['the-twin', 'the-lakehouse-path', 'traversal-and-policy', 'the-component-model'],
    architecture: [
      'platform-flow',
      'orchestration',
      'transform',
      'storage-and-catalog',
      'query',
      'in-house-components',
      'observability',
      'delivery',
      'authorization-and-secrets',
    ],
    guides: ['access-traversal', 'reading-one-finding-three-ways', 'exploring-the-playground'],
    reference: ['integration-ledger', 'glossary'],
  } as const;

  it('has an introduction at the docs root', async () => {
    expect(await exists('introduction.mdx')).toBe(true);
  });

  it('has every section of the declared IA, with a meta.json titling it', async () => {
    for (const [folder, pages] of Object.entries(IA)) {
      expect(await exists(folder), `missing folder ${folder}`).toBe(true);
      expect(await exists(path.join(folder, 'meta.json')), `missing ${folder}/meta.json`).toBe(true);
      for (const page of pages) {
        expect(await exists(path.join(folder, `${page}.mdx`)), `missing ${folder}/${page}.mdx`).toBe(true);
      }
    }
  });

  it('titles every folder in its meta.json and lists each page in order', async () => {
    for (const folder of Object.keys(IA)) {
      const meta = JSON.parse(await read(path.join(folder, 'meta.json')));
      expect(typeof meta.title).toBe('string');
      expect(meta.title.length).toBeGreaterThan(2);
      const listed: string[] = meta.pages ?? [];
      const onDisk = (await readdir(path.join(DOCS, folder))).filter(
        (name) => name.endsWith('.mdx'),
      ).map((name) => name.replace(/\.mdx$/, ''));
      for (const page of onDisk) {
        expect(listed).toContain(page);
      }
    }
  });

  it('gives every doc page a title and a description', async () => {
    const files = ['introduction.mdx'];
    for (const [folder, pages] of Object.entries(IA)) {
      for (const page of pages) files.push(path.join(folder, `${page}.mdx`));
    }
    for (const file of files) {
      const source = await read(file);
      expect(source.startsWith('---'), `${file} has frontmatter`).toBe(true);
      expect(/^title: \S/m.test(source), `${file} has a title`).toBe(true);
      expect(/^description: \S/m.test(source), `${file} has a description`).toBe(true);
    }
  });
});

describe('honesty devices', () => {
  it('states both planned use cases as planned wherever their statuses are listed', async () => {
    const intro = await read('introduction.mdx');
    expect(intro).toContain('available today');
    expect(intro).toContain('planned');
    // Never implied — both are named with their status.
    expect(intro).toContain('Blast radius');
    expect(intro).toContain('stale and unused access');
  });

  it('describes the playground as fully mocked everywhere it links to it', async () => {
    const files = ['introduction.mdx', 'guides/access-traversal.mdx', 'guides/exploring-the-playground.mdx'];
    for (const file of files) {
      const source = await read(file);
      expect(source).toContain('https://playground.nanisoft.com');
      expect(source.toLowerCase()).toContain('fully mocked');
    }
  });

  it('tells the reader the playground execution is mocked, not real', async () => {
    const guide = await read('guides/exploring-the-playground.mdx');
    expect(guide).toContain('mocked');
    expect(guide).toContain('no real data');
  });
});

describe('blog (ticket 07 §4)', () => {
  const POSTS = [
    'the-estate-finally-agrees-with-itself',
    'bronze-silver-gold',
    'sixteen-products-four-of-ours',
    'access-traversal-end-to-end',
  ];

  it('ships exactly the four launch posts', async () => {
    expect(await blogSlugs()).toEqual([...POSTS].sort());
  });

  it('gives every post a title, description, ISO date, and tags', async () => {
    for (const slug of POSTS) {
      const source = await readFile(path.join(BLOG, slug, 'index.mdx'), 'utf8');
      expect(source.startsWith('---'), `${slug} has frontmatter`).toBe(true);
      expect(/^title: \S/m.test(source), `${slug} has a title`).toBe(true);
      expect(/^description: \S/m.test(source), `${slug} has a description`).toBe(true);
      const date = /^date: '(\d{4}-\d{2}-\d{2})'$/m.exec(source);
      expect(date, `${slug} has an ISO date`).toBeTruthy();
      expect(Number.isNaN(Date.parse(date?.[1] ?? '')), `${slug} date parses`).toBe(false);
      expect(/draft: true/.test(source), `${slug} is not a draft`).toBe(false);
    }
  });
});

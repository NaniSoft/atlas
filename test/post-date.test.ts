import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { displayDate, isoDate } from '@/lib/post-date';

/**
 * A post's date is two facts, and this repository now hands the Page two different strings.
 *
 * The design system's `BlogPostPage` types `dateTime` as `${number}-${number}-${number}`
 * and refuses at render a display date and a `dateTime` that are one string. Both of this
 * site's screens were handing the frontmatter's own value to both slots: the index printed
 * `2026-09-21` to the reader and the post Page was handed `2026-09-21` twice.
 *
 * **The bump is what made this visible.** At 0.13.0 the pair compiled and rendered, so the
 * defect was carried silently. At 0.16.1 the narrowing in the Page's own types reaches a
 * consumer as a `tsc` error rather than as a reader's complaint, which is the better of the
 * two: the error names the file and the line. This test exists for the half a type error
 * cannot hold, which is the wiring: a Page that renders a reading from a source that still
 * hands it the raw value in one slot.
 *
 * The narrowing is a throw rather than a cast, on purpose. The frontmatter schema is a
 * `z.string()`, so `date: 2026-9-21` or a date with a time on it would otherwise reach a
 * `datetime` attribute as a cast that nothing can check, and be discovered by a feed reader
 * rather than by this repository. `test/content.test.ts` already reads every frontmatter
 * and proves each date is a quoted ISO one, so the two tests agree about what a post's date
 * is and disagree about nothing.
 */
const ROOT = path.resolve(__dirname, '..');
const BLOG = path.join(ROOT, 'content', 'blog');

/** Every post's frontmatter, as the fields this site's index and Page read. */
function posts(): Array<{ file: string; title: string; date: string; description: string }> {
  return readdirSync(BLOG, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const file = path.join(BLOG, entry.name, 'index.mdx');
      const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, 'utf8'))?.[1] ?? '';
      const field = (name: string) => new RegExp(`^${name}:\\s*(.+)$`, 'm').exec(block)?.[1]?.trim() ?? '';
      return {
        file: `content/blog/${entry.name}/index.mdx`,
        title: field('title'),
        date: field('date').replace(/^['"]|['"]$/g, ''),
        description: field('description'),
      };
    })
    .sort((a, b) => a.file.localeCompare(b.file));
}

describe('the machine value and the reading are separate facts', () => {
  it('narrows a calendar date and throws on anything that is not one', () => {
    expect(isoDate('2026-09-21')).toBe('2026-09-21');
    // Five shapes a `z.string()` frontmatter admits and a `datetime` attribute cannot.
    for (const bad of ['21-09-2026', '2026-9-21', '2026-09-21T00:00:00Z', 'September 21, 2026', '']) {
      expect(() => isoDate(bad), `${JSON.stringify(bad)} is not a calendar date`).toThrow(/not a YYYY-MM-DD/);
    }
  });

  it('reads a date the way the value beside it is written', () => {
    // `en-GB` because the machine value is `YYYY-MM-DD`, so day-first is the reading that
    // matches the value rather than the one that reorders it. `UTC` because a static export
    // renders once on one machine: `2026-09-21` is midnight UTC, and a host west of
    // Greenwich would print the day before.
    expect(displayDate('2026-09-21')).toBe('21 September 2026');
    expect(displayDate('2026-01-05')).toBe('5 January 2026');
    // And it is never the machine value back, which is the whole of the Page's refusal.
    expect(displayDate('2026-09-21')).not.toBe('2026-09-21');
  });

  it('reads the same day on every host, because a static export renders once', () => {
    // The two month ends are the ones a naive local-zone formatter turns into the adjacent
    // year, and this host runs west of UTC, which is the half that would show it.
    expect(displayDate('2026-01-01')).toBe('1 January 2026');
    expect(displayDate('2026-12-31')).toBe('31 December 2026');
    expect(displayDate('2026-08-31')).toBe('31 August 2026');
    expect(displayDate('2026-09-01')).toBe('1 September 2026');
  });

  it('is stable wherever the build runs, which is what an unpinned zone would not be', () => {
    // Read through the same formatter the module uses, once per post: deterministic because
    // the zone is pinned, so a reader who rebuilds this site next year gets the date the
    // post was published rather than the date the build happened.
    for (const post of posts()) {
      expect(displayDate(post.date), post.file).toBe(
        new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(
          new Date(`${isoDate(post.date)}T00:00:00Z`),
        ),
      );
    }
  });
});

describe('every post carries a date this site can publish in two forms', () => {
  it('reads a real corpus, so the loops below are not vacuous', () => {
    expect(posts().length).toBe(4);
  });

  it('declares a calendar date in every frontmatter', () => {
    for (const post of posts()) {
      expect(post.date, `${post.file} declares no date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(() => isoDate(post.date), `${post.file} cannot be narrowed`).not.toThrow();
    }
  });

  it('gives the Page two different strings, and the index one element with two halves', () => {
    // The route cannot be rendered in this runner: it needs the content loader, and
    // `fumadocs-mdx/macro` is compiled by the bundler plugin rather than by vitest. So the
    // route is read as source, which is where the defect was in the first place: the same
    // expression was written in both places.
    const route = readFileSync(path.join(ROOT, 'app', 'blog', '[[...slug]]', 'page.tsx'), 'utf8');

    // The Page's two props: the reading and the machine value, from two different functions.
    expect(route, 'the post Page is handed one string in both date slots').toMatch(
      /date=\{displayDate\(page\.data\.date\)\}\s*\n\s*dateTime=\{isoDate\(page\.data\.date\)\}/,
    );
    expect(route, 'a raw frontmatter value still reaches a date prop').not.toMatch(
      /date(?:Time)?=\{page\.data\.date\}/,
    );

    // The index's `<time>`: the `datetime` attribute is the value and the text is the
    // reading. One element, two facts, which is what a `time` element is for.
    expect(route, "the index's time element prints the machine value to a reader").toMatch(
      /<time dateTime=\{isoDate\(post\.data\.date\)\}>\{displayDate\(post\.data\.date\)\}<\/time>/,
    );
  });
});
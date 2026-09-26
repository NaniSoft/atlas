// Section index page (`/docs`, `/blog` root entries): the section's contents
// as a grouped list. Empty sections render an honest empty state instead of
// breaking the build.

import Link from 'next/link';
import type { ReactElement } from 'react';

export interface IndexGroup {
  group: string;
  items: ReadonlyArray<{ title: string; url: string; description?: string }>;
}

export interface SectionIndexProps {
  title: string;
  description: string;
  groups: IndexGroup[];
  /** Shown when the section has no pages yet. */
  emptyMessage: string;
}

export function SectionIndex({ title, description, groups, emptyMessage }: SectionIndexProps): ReactElement {
  const total = groups.reduce((count, group) => count + group.items.length, 0);

  return (
    <div className="site-index">
      <header className="site-index__head">
        <h1 className="site-index__title">{title}</h1>
        <p className="site-index__lede">{description}</p>
      </header>
      {total === 0 ? (
        <p className="site-empty">{emptyMessage}</p>
      ) : (
        groups.map((group) => (
          <section key={group.group} className="site-index__group">
            <h2 className="site-index__label">{group.group}</h2>
            <ul className="site-index__list">
              {group.items.map((item) => (
                <li key={item.url}>
                  <Link href={item.url} className="site-index__item">
                    <strong>{item.title}</strong>
                    {item.description && <span>{item.description}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

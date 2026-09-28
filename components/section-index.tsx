// The documentation section index (`/docs`): the section's contents as a grouped
// list, in the order the content tree files it. Empty sections render an honest
// empty state instead of breaking the build.
//
// **This composition is this site's own, and the reason is a decision, not an
// omission.** The design system deliberately ships no documentation index Page: a
// Page is judged on what it encodes, and three sites file their documentation
// three different ways, so an index the design system owned would be an index the
// other two had to argue with. The frame is the design system's `Section` and
// `SectionHeading`; the grouped list below them is the one thing on this page the
// catalogue has no item for, so it is four site classes in `app/globals.css` and
// nothing else.

import type { ReactElement } from 'react';

import { Section, SectionHeading } from '@nanisoft/prism-ui/components/section';

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
    <Section>
      <div className="site-index">
        <SectionHeading as="h1" align="left" title={title} description={description} className="site-index__head" />
        {total === 0 ? (
          <p className="site-empty">{emptyMessage}</p>
        ) : (
          groups.map((group) => (
            <section key={group.group} className="site-index__group">
              <h2 className="site-index__label">{group.group}</h2>
              <ul className="site-index__list">
                {group.items.map((item) => (
                  <li key={item.url}>
                    <a href={item.url} className="site-index__item">
                      <strong>{item.title}</strong>
                      {item.description && <span>{item.description}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </Section>
  );
}

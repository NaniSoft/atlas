// The documentation section index (`/docs`): the section's contents as grouped
// lists, in the order the content tree files them. Empty sections render an
// honest empty state instead of breaking the build.
//
// The design system deliberately ships no documentation index Page: a Page is
// judged on what it encodes. The frame here is the design system's `Section`,
// the heading is DS type, and each group is a `ListPanel` of `Item` rows —
// the catalogue's own list vocabulary, so this file carries no styling at all.

import type { ReactElement } from 'react';

import { Section } from '@nanisoft/prism-ui/components/section';
import { SectionHeading } from '@nanisoft/prism-ui/components/section';
import { DSStack } from '@nanisoft/prism-ui/components/ds-stack';
import { ListPanel } from '@nanisoft/prism-ui/components/list-panel';
import { Item } from '@nanisoft/prism-ui/components/item';
import { Text } from '@nanisoft/prism-ui/components/typography';

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
      <DSStack gap="lg">
        <SectionHeading as="h1" align="left" title={title} description={description} />
        {total === 0 ? (
          <Text tone="muted">{emptyMessage}</Text>
        ) : (
          groups.map((group) => (
            <ListPanel key={group.group} title={group.group} scroll={false}>
              <ul>
                {group.items.map((item) => (
                  <li key={item.url}>
                    <Item entry={{ id: item.url, title: item.title, description: item.description, href: item.url }} />
                  </li>
                ))}
              </ul>
            </ListPanel>
          ))
        )}
      </DSStack>
    </Section>
  );
}

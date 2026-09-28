import type { ReactNode } from 'react';
import { NotFoundPage } from '@nanisoft/prism-ui/pages/not-found-page';

/**
 * The not-found screen, and the one page the design system takes whole.
 *
 * Every string is a prop and the Page ships none of them, so the sentence and the
 * three ways out are this site's own, published unchanged. What the Page changes is
 * the shape: the status code becomes the page's heading and the sentence becomes a
 * heading under it, which is the reverse of the order a reader sees them in and the
 * right way round for anything that reads the outline, and the three ways out become
 * real anchors with destinations a reader can see before taking them.
 *
 * The eyebrow this page used to carry has no slot on the Page and is recorded as
 * removed in the content-parity ledger rather than written into the code as a class.
 */
export default function NotFound(): ReactNode {
  return (
    <NotFoundPage
      code="404"
      title="No node here."
      description="This page does not exist (yet). The estate is fully mapped — this URL just is not in the graph."
      links={[
        { label: 'Back to the landing', href: '/' },
        { label: 'Read the docs', href: '/docs' },
        { label: 'Read the blog', href: '/blog' },
      ]}
      linksLabel="Ways out"
    />
  );
}

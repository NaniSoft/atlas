import type { Metadata } from 'next';

import { Landing } from '@/components/landing/landing';

export const metadata: Metadata = {
  // The product frame first (ticket 07's migration law), the flagship
  // instance second — the same order the hero reads in.
  description:
    'Atlas models the real world digitally — living representations of systems, assets, and operations. Its first proven domain: a digital twin of the IT estate.',
  title: {
    absolute: 'Atlas — Model the real world digitally',
  },
};

export default function HomePage() {
  return <Landing />;
}

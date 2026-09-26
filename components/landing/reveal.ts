'use client';

// Scroll-reveal plumbing (the prism www-landing prototype's pattern): attach
// the returned ref to a root; every [data-reveal] descendant gets .is-in when
// it enters the viewport (once). Reduced motion short-circuits to visible.
// Motion law ADR-0001: 280ms decelerating, transform + opacity only.
//
// The hidden state is OPT-IN. The stylesheet only hides a [data-reveal] inside
// a root carrying [data-reveal-ready], and this effect sets that attribute —
// so the markup ships visible and the page can never be stranded blank if
// hydration is slow or fails, or if scripting is off. The prototype hid in
// CSS and un-hid from JS, which inverts that safety: found in build, fixed
// here rather than carried into production.

import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';

export function useRevealRoot(): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Render everything settled; never arm the hidden state at all.
      targets.forEach((target) => target.classList.add('is-in'));
      return;
    }
    root.setAttribute('data-reveal-ready', '');
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    targets.forEach((target) => io.observe(target));
    return () => io.disconnect();
  }, []);

  return ref;
}

/** Spread onto any element: <div {...reveal(60)}> — entrance stagger in ms. */
export function reveal(delayMs = 0): { 'data-reveal': 'true'; style: CSSProperties } {
  return { 'data-reveal': 'true', style: { transitionDelay: `${delayMs}ms` } };
}

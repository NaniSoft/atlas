import type { ReactElement } from 'react';

/**
 * The Atlas mark, at the sizes a page draws it.
 *
 * One node of the estate, emphasised, with three of its neighbours around it: the
 * same claim the hero's graph makes, condensed to the five shapes a reader can
 * read at twenty-two pixels. Every stroke is `currentColor`, so the mark follows
 * the ink it sits beside, and the emphasised node is the pack's own primary
 * through a token class, so a pack boundary above it repaints the accent without
 * touching this file. A logo that named a hex would be the one element on the
 * page a theme could not reach.
 */
export function AtlasLogo({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}): ReactElement {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="Atlas"
      className={className ? `site-logo ${className}` : 'site-logo'}
    >
      <g stroke="currentColor" strokeWidth="1.6">
        <path d="M16 16 L16 5.5" />
        <path d="M16 16 L26 22" />
        <path d="M16 16 L6 22" />
      </g>
      <circle cx="16" cy="16" r="3.2" className="site-logo__accent" />
      <circle cx="16" cy="5.5" r="2.4" fill="currentColor" />
      <circle cx="26" cy="22" r="2.4" fill="currentColor" />
      <circle cx="6" cy="22" r="2.4" fill="currentColor" />
    </svg>
  );
}

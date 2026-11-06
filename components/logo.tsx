import type { ReactElement } from 'react';

/**
 * The Atlas mark, at the sizes a page draws it.
 *
 * The twin, the claim the name makes: the estate on the left in ink and its
 * living model on the right, one the mirror of the other across the peak where
 * they agree, condensed to the three shapes a reader can read at twenty-two
 * pixels. The estate stroke is `currentColor`, so the mark follows the ink it
 * sits beside, and the twin stroke and the peak are the pack's own primary
 * through token classes, so a pack boundary above it repaints the accent
 * without touching this file. A logo that named a hex would be the one element
 * on the page a theme could not reach.
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
      <g strokeLinecap="round" strokeWidth="2.5">
        <path d="M4 21.5 L16 16" stroke="currentColor" />
        <path d="M16 16 L28 21.5" className="site-logo__accent-stroke" />
      </g>
      <circle cx="16" cy="16" r="2.4" className="site-logo__accent" />
    </svg>
  );
}

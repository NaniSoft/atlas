// Negative fixture - ASSET002: unapproved variant; ASSET012: missing intrinsic dimensions.
import { DSImage } from '@nanisoft/prism-ui/components/ds-image';
export function NegVariant() {
  return <DSImage src="/hero.png" alt="hero" variant="mega-wide" />;
}

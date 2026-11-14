// Negative fixture - ASSET010/ASSET014: presentation bypass on DSImage.
import { DSImage } from '@nanisoft/prism-ui/components/ds-image';
export function NegFit() {
  return <DSImage src="/hero.png" alt="hero" variant="hero" width={1200} height={675} objectFit="cover" />;
}

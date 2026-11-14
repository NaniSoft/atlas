// Negative fixture - UI008: DS component override with a site class.
import { Text } from '@nanisoft/prism-ui/components/typography';
export function NegOverride() {
  return <Text className="site-fixture">oops</Text>;
}

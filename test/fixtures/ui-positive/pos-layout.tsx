// Positive fixture - approved layout + media composition.
import { DSGrid } from '@nanisoft/prism-ui/components/ds-grid';
import { DSStack } from '@nanisoft/prism-ui/components/ds-stack';
import { DSImage } from '@nanisoft/prism-ui/components/ds-image';
import { DSIcon } from '@nanisoft/prism-ui/components/ds-icon';
import { Heading, Text } from '@nanisoft/prism-ui/components/typography';
export function PosLayout() {
  return (
    <DSStack gap="md">
      <Heading as="h2" size="2xl">Title</Heading>
      <Text tone="muted">Supporting copy.</Text>
      <DSGrid columns={2} gap="md">
        <DSImage src="/hero.png" alt="hero" variant="hero" width={1200} height={675} />
      </DSGrid>
      <DSIcon name="settings" />
    </DSStack>
  );
}

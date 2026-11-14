// Positive fixture - approved DS composition: Diagram data in, no styling of its own.
import { Diagram } from '@nanisoft/prism-ui/components/diagram';
export function PosDiagram() {
  return (
    <Diagram
      label="One person reaches one product."
      nodes={[
        { id: 'person', name: 'One person', x: 0, y: 50 },
        { id: 'product', name: 'Sensitive product', x: 100, y: 50, emphasis: true },
      ]}
      relations={[{ from: 'person', to: 'product', label: 'Membership' }]}
    />
  );
}

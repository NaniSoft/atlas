// Negative fixture - ASSET001: raw image rendering; ASSET008: inline SVG.
export function NegImage() {
  return (
    <div>
      <img src="/x.png" alt="x" />
      <svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" /></svg>
    </div>
  );
}

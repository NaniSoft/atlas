// Negative fixture - UI011: responsive styling the sheet does not publish.
// The variant must be one no rule in the design system's sheet answers, so it
// is dead at every width; `sm:block` stopped being a fixture when Prism 1.9
// emitted the documented pair, and `md:block` is still unpublished.
export function NegResponsive() {
  return <div className="prism-text-spectrum md:block">oops</div>;
}

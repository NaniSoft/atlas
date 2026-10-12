import { ImageResponse } from 'next/og';

/**
 * The share card.
 *
 * **Generated once, at build.** Under `output: 'export'` a metadata route has to be
 * told it is static, and the image is painted from constants with no request to be
 * dynamic with. It replaces the 32-pixel mark that stood in before, which rendered
 * as a postage stamp wherever a full-size card was expected.
 *
 * **The card is the site's own default mode.** Atlas opens dark, on the mint pack,
 * so the card is the dark mint theme's own values written out as literals: an image
 * is painted once into a bitmap, there is no cascade and no `data-pack`, and a token
 * read here would resolve to the neutral base and contradict the page it previews.
 * The chips are the family's product packs, and the spectrum bar stands for Prism,
 * whose mark owns no single hue.
 */
export const alt = 'Atlas: the Digital Twin Platform'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export const dynamic = 'force-static'

const GROUND = '#161917'
const INK = '#ebeeeb'
const MUTED = '#c7ccc8'
const HAIRLINE = '#3f4440'
const MINT = '#9ddcad'
const CYAN = '#7fdaf0'
const SKY = '#9bd1ff'
const GOLD = '#edc47d'

const SPECTRUM =
  'linear-gradient(90deg, #ec88a0 0%, #bc97e7 25%, #73bf88 50%, #6cb2eb 75%, #e4965e 100%)'

/**
 * The mark, as the card draws it: the estate's emphasised node and three of its
 * neighbours, painted in the card's own literals and embedded as a data URI,
 * because the renderer paints a bitmap and cannot resolve cascade classes.
 */
const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="150" height="150" fill="none">
  <g stroke="#9ddcad" stroke-width="1.6">
    <path d="M16 16 L16 5.5"/>
    <path d="M16 16 L26 22"/>
    <path d="M16 16 L6 22"/>
  </g>
  <circle cx="16" cy="16" r="3.2" fill="#9ddcad"/>
  <circle cx="16" cy="5.5" r="2.4" fill="#ebeeeb"/>
  <circle cx="26" cy="22" r="2.4" fill="#ebeeeb"/>
  <circle cx="6" cy="22" r="2.4" fill="#ebeeeb"/>
</svg>`
const MARK_URI = `data:image/svg+xml;base64,${Buffer.from(MARK_SVG).toString('base64')}`

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: GROUND,
          color: INK,
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', fontSize: 26, letterSpacing: 2, color: MINT }}>
              NANISOFT · THE DIGITAL TWIN PLATFORM
            </div>
            <img src={MARK_URI} width={140} height={140} style={{ opacity: 0.9 }} />
          </div>
          <div style={{ display: 'flex', fontSize: 110, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
            Atlas
          </div>
          <div style={{ display: 'flex', fontSize: 36, color: MUTED, lineHeight: 1.35, maxWidth: 900 }}>
            A digital twin of the IT estate: see how your systems connect and actually work.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: `2px solid ${HAIRLINE}`,
            paddingTop: 32,
          }}
        >
          <div style={{ display: 'flex', fontSize: 26, color: MUTED }}>atlas.nanisoft.com</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {[SKY, CYAN, MINT, GOLD].map((colour) => (
                <div
                  key={colour}
                  style={{ display: 'flex', width: 30, height: 30, borderRadius: 15, background: colour }}
                />
              ))}
            </div>
            <div
              style={{
                display: 'flex',
                width: 54,
                height: 30,
                borderRadius: 15,
                background: SPECTRUM,
              }}
            />
          </div>
        </div>
      </div>
    ),
    size,
  )
}

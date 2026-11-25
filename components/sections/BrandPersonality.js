import { siteContent } from "@/data/siteContent";
import Sticker from "@/components/ui/Sticker";

const copy = siteContent.brandPersonality;

// Brand Personality, between two orange-and-yellow checker borders (the
// bottom one leads into Our Story's orange):
//   - a photo band: a close-up of the ice cream (public/background-img), with
//     the yellow heading, a short line and an "ORDER NOW" button over it, a
//     round teal badge sticker (/stickers/sticker1.png, slowly turning)
//     stuck on the heading's left and a sticker on its top-right
//   - a yellow band: four tilted flavour cards (flick one and it's thrown,
//     then springs back), some with a frosted label hanging off an edge, over
//     a giant line of type running as a faint marquee
// Motion: animations/joy.js · styles: app/styles/sections/brand-personality.css
export default function BrandPersonality() {
  const bg = copy.background;
  return (
    <section className="joy" id="personality">
      <div className="checker" aria-hidden="true" />

      {/* ----- The photo band ----- */}
      <div className="joy-photo">
        <img className="joy-photo-bg" src={bg.img} width={bg.size[0]} height={bg.size[1]} alt="" loading="lazy" decoding="async" />

        <div className="joy-copy">
          <div className="joy-titled">
            <h2 className="joy-heading">
              {copy.heading.map((line) => (
                <span key={line} className="joy-line">
                  <span>{line}</span>
                </span>
              ))}
            </h2>

            {/* the round teal badge sticker: spins in, then turns slowly */}
            <div className="joy-badge" aria-hidden="true">
              <img className="joy-badge-ring" src={copy.badge.img} width={copy.badge.size[0]} height={copy.badge.size[1]} alt="" loading="lazy" decoding="async" />
            </div>

            {/* the stickers on the top-right corner (pop on as they scroll
                into view): the teal zigzag, then the yellow oval over its
                lower-right end */}
            <Sticker src={copy.sticker.img} size={copy.sticker.size} corner="bl" rot={0} pop className="joy-sticker" />
            <Sticker src={copy.stickerOval.img} size={copy.stickerOval.size} corner="br" rot={8} pop delay={0.25} className="joy-sticker-oval" />
          </div>

          <p className="joy-text">{copy.text}</p>
          <a className="joy-cta" href={copy.cta.href} data-magnet>
            <span className="magnet-label">{copy.cta.label}</span>
          </a>
        </div>
      </div>

      {/* ----- The yellow band ----- */}
      <div className="joy-cards">
        {/* the line of type as an endless, faint marquee behind the cards:
            four copies, so one copy's width of travel loops seamlessly */}
        <div className="joy-crave" aria-hidden="true">
          <div className="joy-crave-track">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className="joy-crave-item">
                {copy.crave}
              </span>
            ))}
          </div>
        </div>
        <ul className="joy-card-row">
          {copy.cards.map((c, i) => (
            <li key={i} className={`joy-card${c.label ? ` joy-card--${c.label.pos}` : ""}`} style={{ "--tint": c.tint, "--rot": c.rot }} data-rot={c.rot}>
              <img src={c.img} width={c.size[0]} height={c.size[1]} alt={c.alt} loading="lazy" decoding="async" draggable="false" />
              {c.label && <span className="joy-card-label">{c.label.text}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

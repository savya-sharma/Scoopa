import { siteContent } from "@/data/siteContent";
import { flavours } from "@/data/products";
import Lines from "@/components/ui/Lines";
import Sticker from "@/components/ui/Sticker";

const copy = siteContent.flavours;

// Flavours section, on orange (carrying on from the hero, whose glossy "OO"
// hangs down into its top): the big cream heading with the "SCOOP. SMILE.
// REPEAT" sticker on its left and a second sticker on its top-right corner,
// then a slider of bowls on a gentle arc, all the same size, moved by the
// arrows (animations/flavours.js). Styles: app/styles/sections/flavours.css
// (The flavours' pop-out decorations, flavourDecor in data/products.js, are
// not shown in this design; the slider code still supports them.)
export default function Flavours() {
  return (
    <section className="flavours-intro" id="flavours">
      {/* The heading and its two stickers, as one composition */}
      <div className="titled flavours-titled">
        <Sticker n={1} corner="br" rot={-10} className="sticker--flavours" />
        <h2 className="flavours-heading" data-split="chars">
          <Lines text={copy.heading} />
        </h2>
        <Sticker src={copy.sticker.img} size={copy.sticker.size} corner="bl" rot={12} pop className="sticker--flavours-right" />
      </div>

      <div className="flavour-slider" role="region" aria-roledescription="carousel" aria-label={copy.sliderLabel}>
        <ul className="flavour-track">
          {flavours.map((f, i) => (
            <li key={f.img} className="flavour-item">
              <img className="flavour-bowl" src={f.img} width={f.size[0]} height={f.size[1]} alt={f.alt} loading="lazy" decoding="async" />
              {/* The name, centred under its bowl */}
              <svg className={`flavour-name${f.name.length > 16 ? " flavour-name--long" : ""}`} viewBox="0 0 200 30" role="img" aria-label={f.name}>
                <path id={`flavour-arc-${i}`} d="M 4 20 L 196 20" fill="none" />
                <text>
                  <textPath href={`#flavour-arc-${i}`} startOffset="50%" textAnchor="middle">
                    {f.name}
                  </textPath>
                </text>
              </svg>
            </li>
          ))}
        </ul>

        <div className="flavour-arrows">
          <button type="button" className="flavour-arrow" data-magnet data-dir="-1" aria-label={copy.previous}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          </button>
          <button type="button" className="flavour-arrow" data-magnet data-dir="1" aria-label={copy.next}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>
    </section>
  );
}

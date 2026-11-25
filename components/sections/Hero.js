import { siteContent } from "@/data/siteContent";

const copy = siteContent.hero;

// The band's path (in the band SVG's 100-wide viewBox, so 1 unit = 1% of the
// hero's width): in from the left edge, dipping down behind the friends, then
// rising gently out to the right edge
const BAND_PATH = "M -4 6 C 10 16, 28 24, 50 17 S 84 5, 104 10";

// One of the two wavy double lines at the hero's sides (the right one is
// this mirrored, in CSS). Drawn along their length (animations/hero.js).
function Squiggle({ side }) {
  const d = "M 0 4 C 34 9, 54 36, 40 71 C 28 103, 74 125, 62 162 C 52 194, 14 210, 0 239";
  return (
    <svg className={`hero-squiggle hero-squiggle--${side}`} viewBox="0 0 80 250" aria-hidden="true">
      <path className="hero-squiggle-line" d={d} pathLength="1" />
      <path className="hero-squiggle-line" d={d} pathLength="1" transform="translate(13 2)" />
    </svg>
  );
}

// The hero: an orange stage with the two-line cream headline, small navy
// "FLAVOUR'S" text stickers stuck over it, a wavy yellow double line at each
// side, the friends sitting on the glossy "OO" in the lower left, and behind
// them a curving yellow band with "SCOOP.SMILE.REPEAT *" running along it as
// an endless marquee (the "OO" hangs on into the next section).
// The overlay is the circles loader (used when INTRO_STYLE is "circles").
// Motion: animations/hero.js · styles: app/styles/sections/hero.css
export default function Hero() {
  return (
    <section className="hero">
      {/* The page's main heading; the oversized headline is its decorative,
          visual counterpart */}
      <h1 className="sr-only">{copy.title}</h1>

      {/* The headline, line by line, letter by letter: each letter rises out
          of its line's mask */}
      <div className="hero-title" aria-hidden="true">
        {copy.headline.map((line, l) => (
          <span key={l} className="hero-title-line">
            {line.split(" ").map((word, w) => (
              <span key={w} className="hero-title-word">
                {[...word].map((ch, i) => (
                  <span key={i} className="hero-title-char">
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </span>
        ))}
      </div>

      {/* The text stickers stuck over the headline (placed in CSS, in order) */}
      {copy.stickers.map((text, i) => (
        <span key={i} className={`hero-tag hero-tag--${i + 1}`} aria-hidden="true">
          {text}
        </span>
      ))}

      {/* The wavy double lines at either side */}
      <Squiggle side="left" />
      <Squiggle side="right" />

      {/* The curving yellow band, its words running along it (animations/hero.js) */}
      <svg className="hero-band" viewBox="0 0 100 30" aria-hidden="true">
        <path id="hero-band-path" className="hero-band-stroke" d={BAND_PATH} />
        <text className="hero-band-text" dominantBaseline="central">
          <textPath href="#hero-band-path" startOffset="0">
            {copy.band.repeat(8)}
          </textPath>
        </text>
      </svg>

      {/* The glossy "OO", hanging below the hero into the next section */}
      <img className="hero-oo" src="/illustrators/web/hero-oo.webp" width="612" height="442" alt="" decoding="async" />

      {/* The friends, sitting on the "OO" */}
      <img className="hero-group" src="/illustrators/web/friends.webp" width="900" height="525" alt="" decoding="async" />

      <div className="hero-overlay">
        {/* three concentric circles, back to front: orange, teal, navy */}
        <span className="loader-circle loader-circle--orange" />
        <span className="loader-circle loader-circle--teal" />
        <span className="loader-circle loader-circle--navy" />
      </div>
    </section>
  );
}

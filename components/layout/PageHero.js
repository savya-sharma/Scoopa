import { siteContent } from "@/data/siteContent";

// The title band at the top of an inner page: a navy awning with the hero's
// scalloped edge, a yellow tag, the page's big title and a short intro, and
// the page's character hanging over the scallops into the section below, a
// starburst behind it. Copy and character: siteContent.pages (data/siteContent.js).
// Motion: animations/pageIntro.js · styles: app/styles/layout/page-hero.css
//
//   page:  which page's copy (a key of siteContent.pages)
//   below: the colour of the section that follows (cream | yellow | mint),
//          shown between the scallops so the two meet cleanly
export default function PageHero({ page, below = "cream" }) {
  const copy = siteContent.pages[page];
  return (
    <section className="page-hero" data-page={page} data-below={below}>
      <div className="page-hero-awning" aria-hidden="true" />

      <div className="page-hero-copy">
        <p className="page-hero-label">{copy.label}</p>
        <h1 className="page-hero-title">
          {copy.title.map((line) => (
            // each line rises out of its own mask
            <span key={line} className="page-hero-line">
              <span>{line}</span>
            </span>
          ))}
        </h1>
        <p className="page-hero-intro">{copy.intro}</p>
      </div>

      <div className="page-hero-figure" aria-hidden="true">
        <svg className="page-hero-burst" viewBox="0 0 200 200">
          <use href="#shape-burst" />
        </svg>
        <img className="page-hero-art" src={copy.art.src} width={copy.art.size[0]} height={copy.art.size[1]} alt="" decoding="async" />
      </div>
    </section>
  );
}

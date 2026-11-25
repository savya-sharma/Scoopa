import { siteContent } from "@/data/siteContent";

const copy = siteContent.ourStory;
const TRAIL_POOL = copy.trail.length * 3;

// Our Story: orange, under Brand Personality's bottom checker border, with a
// checker border (yellow and orange) along its own bottom: the
// big cream statement, line by line, and a small teal ribbon button to the
// About page. With a mouse, stickers pop up along the pointer's trail over
// the section and pop away again in turn.
// Motion: animations/story.js · styles: app/styles/sections/our-story.css
//   cta: show the button (off on the About page it links to)
export default function OurStory({ cta = true }) {
  return (
    <section className="story" id="story">
      {/* (no top border: Brand Personality's bottom one leads in) */}
      {/* the mouse trail: a pool of stickers, three of each, reused in turn
          (animations/story.js); hidden until one is placed */}
      <div className="story-trail" aria-hidden="true">
        {Array.from({ length: TRAIL_POOL }, (_, i) => {
          const s = copy.trail[i % copy.trail.length];
          return <img key={i} src={s.img} width={s.size[0]} height={s.size[1]} alt="" loading="lazy" decoding="async" />;
        })}
      </div>

      <div className="story-body">
        <h2 className="sr-only">{copy.heading}</h2>
        {/* each line rises out of its own mask */}
        <p className="story-text">
          {copy.statement.map((line) => (
            <span key={line} className="story-line">
              <span>{line}</span>
            </span>
          ))}
        </p>
        {cta && (
          <a className="story-cta" href={copy.cta.href} data-magnet>
            <span className="magnet-label">{copy.cta.label}</span>
          </a>
        )}
      </div>

      <div className="checker checker--shift" aria-hidden="true" />
    </section>
  );
}

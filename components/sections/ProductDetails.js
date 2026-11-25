import { siteContent } from "@/data/siteContent";
import { flavours } from "@/data/products";
import Lines from "@/components/ui/Lines";
import { Shape } from "@/components/ui/Shapes";

const copy = siteContent.productDetails;

// Product Details, on orange, under a checker border (running on from Brand
// Personality's yellow band above): the heading and intro over a scribbled
// yellow sun, then one row per ice cream,
// alternating sides. Each row: the bowl on a yellow disc, its name curving
// under the disc, a teal day badge and a "YUM FLAVOUR" starburst stuck on,
// beside a label, a title, a description and the price.
// Copy: data/siteContent.js (productDetails) · motion: animations/decor.js ·
// styles: app/styles/sections/product-details.css
export default function ProductDetails() {
  return (
    <section className="details" id="product">
      <div className="checker" aria-hidden="true" />

      <header className="details-head">
        {/* the scribbled sun behind the heading (public/stickers) */}
        <img className="details-sun" src={copy.sun.img} width={copy.sun.size[0]} height={copy.sun.size[1]} alt="" loading="lazy" decoding="async" />
        <h2 className="details-heading">{copy.heading}</h2>
        <p className="details-intro">{copy.intro}</p>
      </header>

      <ul className="details-list">
        {copy.items.map((item, i) => {
          const f = flavours[item.flavour];
          return (
            <li key={item.day} className="details-item">
              <div className="details-visual">
                <span className="details-disc" aria-hidden="true" />
                <img className="details-bowl" src={f.img} width={f.size[0]} height={f.size[1]} alt={f.alt} loading="lazy" decoding="async" />
                {/* the name, on an arc under the disc */}
                <svg className="details-curve" viewBox="0 0 400 400" aria-hidden="true">
                  <path id={`details-arc-${i}`} d="M 18.2 290 A 202 202 0 0 0 381.8 290" fill="none" />
                  <text>
                    <textPath href={`#details-arc-${i}`} startOffset="50%" textAnchor="middle">
                      {item.curve}
                    </textPath>
                  </text>
                </svg>
                <span className="details-day">
                  <span aria-hidden="true">{item.day}</span>
                  <span className="sr-only">{item.dayLabel}</span>
                </span>
                <Shape name="burst" className="details-burst">
                  <Lines text={copy.burst} />
                </Shape>
              </div>

              <div className="details-copy">
                <p className="details-label">{item.label}</p>
                <h3 className="details-title">{item.title}</h3>
                <p className="details-text">{item.text}</p>
                <p className="details-price">{item.price}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

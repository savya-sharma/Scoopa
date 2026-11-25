import { brand, siteContent } from "@/data/siteContent";
import { footerLinks } from "@/data/navigation";
import { ingredients } from "@/data/products";

// Each ingredient twice: a pool for animations/ingredients.js to launch from
const INGREDIENT_POOL = [...ingredients, ...ingredients];

const copy = siteContent.footer;

// Footer, on yellow (after Our Story's checker border): the sign-off, all
// in cream: links and copyright over a thin rule, the brand line, and the
// big wordmark.
//   contactForm: open with a big "Get in touch" heading and the contact form
//   (for a Contact page; not used at the moment)
export default function Footer({ contactForm = false }) {
  const form = copy.form;
  return (
    <footer className={`footer${contactForm ? " footer--contact" : ""}`} id="contact">
      {/* Ingredients bouncing up from the bottom edge: in front of the
          wordmark, behind the text and links
          (animations/ingredients.js · styles/ui/ingredients.css) */}
      <div className="footer-ingredients" aria-hidden="true">
        {INGREDIENT_POOL.map((item, i) => (
          <img key={i} className="footer-ingredient" src={item.src} width={item.size[0]} height={item.size[1]} data-scale={item.scale} alt="" loading="lazy" decoding="async" draggable="false" />
        ))}
      </div>

      {contactForm && <h2 className="footer-title" data-split="chars">{copy.heading}</h2>}

      {/* ⚠️ the form has no backend yet: Experience stops it submitting
          (components/layout/Experience.js) */}
      {contactForm && (
        <form className="footer-form" data-contact-form>
          <p className="footer-ask">{form.prompt}</p>
          <label className="sr-only" htmlFor="contact-name">{form.fields.name.label}</label>
          <input id="contact-name" name="name" type="text" autoComplete="name" placeholder={form.fields.name.placeholder} required />
          <label className="sr-only" htmlFor="contact-email">{form.fields.email.label}</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" placeholder={form.fields.email.placeholder} required />
          <label className="sr-only" htmlFor="contact-phone">{form.fields.phone.label}</label>
          <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder={form.fields.phone.placeholder} />
          <label className="sr-only" htmlFor="contact-message">{form.fields.message.label}</label>
          {/* data-lenis-prevent: a long message scrolls inside the box, not the page */}
          <textarea id="contact-message" name="message" placeholder={form.fields.message.placeholder} required data-lenis-prevent />
          <button type="submit">{form.submit}</button>
        </form>
      )}

      {/* the sign-off: links and copyright over a rule, the brand line, and the
          wordmark set as wide as the page */}
      <div className="footer-sign">
        <div className="footer-sign-top">
          <nav aria-label="Footer">
            <ul className="footer-links">
              {footerLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="footer-copy">{copy.copyright.replace("{year}", new Date().getFullYear())}</p>
        </div>
        <p className="footer-statement" data-split="lines">{copy.statement}</p>
        <img className="footer-wordmark" src="/logo/scoopa-logo-2.webp" width="1339" height="444" alt={brand.name} loading="lazy" />
      </div>
    </footer>
  );
}

import { siteContent } from "@/data/siteContent";
import { menuLinks } from "@/data/navigation";

const copy = siteContent.header;

// The menu (animated by animations/menu.js): a yellow "MENU" pill in the
// top-right corner. Pressing it grows a yellow rounded-corner panel out of
// that corner, under the button, and the page links rise in; the button
// turns navy and reads "CLOSE". Pressing it again (or Escape, a click
// outside the panel, or picking a link) shrinks the panel back into the corner.
export default function Menu() {
  return (
    <>
      {/* darkens the whole screen behind the open menu (faded by
          animations/menu.js; a click on it closes the menu) */}
      <div className="menu-backdrop" aria-hidden="true" />

      {/* The panel, under the button. (Outside .menu, whose transform would
          pin a fixed child to it.) */}
      <div className="menu-card" id="site-menu" inert>
        {/* data-lenis-prevent: scrolls natively when the screen is too short */}
        <nav className="menu-panel" aria-label={copy.menuLabel} data-lenis-prevent>
          <ul className="menu-list">
            {menuLinks.map((link) => (
              <li key={link.href} className="menu-item">
                <a className="menu-link" href={link.href}>
                  <span className="menu-label">
                    <span>{link.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* The button, top-right (drops in with the header: animations/hero.js) */}
      <div className="menu">
        <button className="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" data-magnet>
          {/* both words stacked in one mask; the open state slides to CLOSE */}
          <span className="magnet-label menu-toggle-words">
            <span className="menu-toggle-word">{copy.menu}</span>
            <span className="menu-toggle-word" aria-hidden="true">
              {copy.close}
            </span>
          </span>
        </button>
      </div>
    </>
  );
}

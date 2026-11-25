// Fixed header: the wordmark top-left (styles/layout/nav.css folds the empty
// first slot away; the menu button sits in the top-right corner). It
// starts hidden and slides in during the hero intro (animations/hero.js).
import { brand, siteContent } from "@/data/siteContent";

export default function Header() {
  return (
    <nav>
      <div className="nav-item" />
      <div className="nav-item">
        <a href="/" aria-label={siteContent.header.homeLabel}>
          <img src="/logo/scoopa-logo-2.webp" width="1339" height="444" alt={brand.name} />
        </a>
      </div>
      {/* (right slot: the menu button sits here, components/layout/Menu.js) */}
      <div className="nav-item" />
    </nav>
  );
}

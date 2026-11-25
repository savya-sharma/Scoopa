# Scoopa: where things live

## Updating the copy

All homepage text is in `data/`, so client copy never requires touching
components, styles or animations:

| File | Holds |
|---|---|
| `data/siteContent.js` | Every heading, paragraph, label and button, grouped by section; page title and description; the inner pages' title bands (`pages`: tag, title, intro, character) |
| `data/products.js` | The flavour lineup (names, alt text, images) and the product image |
| `data/navigation.js` | Menu, footer, social and legal links (the menu opens the inner pages) |

Headings stored as arrays are line-by-line: each item starts a new line.
Items marked ⚠️ in those files are placeholders or unconfirmed claims:

- **Flavours 5–8** have numbered placeholder names (no packaging names them).
- **Product claims** ("Small-batch", "Real fruit", "Churned every morning"…)
  come from the supplied design; confirm them with the client.
- **Social and legal links** point to `#`.
- **Product image**: the only transparent product photo supplied is another
  brand's packaging (Van salgados), used as a stand-in.
- **Hero side lines** (`hero.side` in `data/siteContent.js`): new copy
  written for the hero; confirm it with the client.
- **Flavours and Brand Personality tickets, Brand Personality's line** (in
  `data/siteContent.js`): new copy; confirm it with the client. Its
  **"ORDER NOW"** button links to Contact until there's an ordering page.
- **Inner pages' title bands** (`pages` in `data/siteContent.js`): new copy
  written for these pages; confirm it with the client.
- **Contact form** (Contact page): it has no backend yet, so it doesn't send.

## Pages

| Route | File | Holds |
|---|---|---|
| `/` | `app/page.js` | The homepage |
| `/about` | `app/about/page.js` | Not built yet: its name only |
| `/flavours` | `app/flavours/page.js` | Not built yet: its name only |
| `/brand-personality` | `app/brand-personality/page.js` | Not built yet: its name only |
| `/contact` | `app/contact/page.js` | Not built yet: its name only |

The unbuilt pages use `components/layout/PagePlaceholder.js` (header, menu
and the page's name). Ready for building them, though unused for now:
`components/layout/SitePage.js` (header, menu, footer around a page's
sections), `components/layout/PageHero.js` (the navy title band with a
character; copy in `pages`, `data/siteContent.js`) and the footer's contact
form (`<SitePage contactForm>`). The inner pages' entrance is `animations/pageIntro.js`.

## Code

| Folder | Holds |
|---|---|
| `components/layout/` | Header, Menu, Footer, `Experience` (starts all animation) and `PageTransition` (the square wipe: intro loader and page transitions; switch the intro back to the circles with `INTRO_STYLE` in `animations/pageTransition.js`) |
| `components/sections/` | One file per homepage section, top to bottom |
| `components/ui/` | Shared pieces: stickers, decorative shapes, line breaks |
| `animations/` | GSAP setup per feature (hero, menu, slider, stickers…) |
| `app/styles/` | `tokens.css` (design tokens), `base.css`, then layout, section and UI styles, imported in order by `app/globals.css` |

## Images (`public/`)

Only files the site loads are kept; source originals and reference images
were removed, so keep your own copies of those.

| Folder | Used for |
|---|---|
| `flavours/web/` | Flavour bowls in the slider (1–4 WebP; 5–8 the supplied PNGs, ~450 KB each, worth converting) |
| `products/web/` | The product box (hero) |
| `illustrators/web/` | The hero's friends and glossy "OO", the menu characters and its star |
| `illustrators/stickers/web/` | The three heading stickers |
| `stickers/web/` | Web copies of `stickers/*.png`: the scribbled sun behind Product Details' heading (`sticker5.webp`), and with `sticker1.webp` and `sticker2.webp` (trimmed, 360px wide) part of Our Story's mouse trail, alongside the three heading stickers (the trail's list: `siteContent.ourStory.trail`) |
| `background-img/` | The ice cream close-up behind Brand Personality's photo band (`web/bgimg.webp`, 113 KB, is the one the site loads; `bgimg.png` is the 1.8 MB original) |
| `logo/`, `logo.svg` | The wordmark (header, menu, loader, footer) and the browser-tab icon |
| `fonts/` | Lilita One (display) and Fredoka Condensed (text and UI) |

## Assets still needed

| For | What to supply | Replaces |
|---|---|---|
| Brand Personality — cards | Four portrait lifestyle photos (2:3, ~800 × 1200px): e.g. cups being shared, a stacked cone, scoops on a tray, scoops from above | the flavour bowls on tints, `cards` in `data/siteContent.js` |
| Specials — treats (only if Specials goes back on a page: it's off the homepage for now, its component kept in `components/sections/Specials.js`) | Standalone scoop / fruit / sprinkle renders, transparent PNG | the SVG stand-ins in `components/ui/Treats.js` |

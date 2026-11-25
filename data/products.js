// Product data: the flavour lineup and the product image.
// Images live in public/ (see ASSET-MAP.md); size = the image's pixel size.

// The flavour slider, in order.
// name: shown under the bowl · alt: describes the photo for screen readers
export const flavours = [
  { name: "Alphonso Mango", alt: "A bowl of Alphonso Mango ice cream", img: "/flavours/web/flavour1.webp", size: [500, 500] },
  { name: "Butter Scotch", alt: "A bowl of Butter Scotch ice cream", img: "/flavours/web/flavour2.webp", size: [500, 500] },
  { name: "Kesar Pista", alt: "A bowl of Kesar Pista ice cream", img: "/flavours/web/flavour3.webp", size: [429, 429] },
  { name: "Double Chocolate", alt: "A bowl of Double Chocolate ice cream", img: "/flavours/web/flavour4.webp", size: [500, 500] },
  { name: "Vanilla", alt: "A bowl of Vanilla ice cream", img: "/flavours/web/flavour5.png", size: [500, 500] },
  { name: "Rajbhog", alt: "A bowl of Rajbhog ice cream", img: "/flavours/web/flavour6.png", size: [500, 500] },
  { name: "Strawberry & Vanilla", alt: "A bowl of Strawberry & Vanilla ice cream", img: "/flavours/web/flavour7.png", size: [500, 500] },
  { name: "Tutti Frutti Carnival", alt: "A bowl of Tutti Frutti Carnival ice cream", img: "/flavours/web/flavour8.png", size: [500, 500] },
];

// What bursts out from behind each flavour's bowl when it reaches the centre
// of the slider (animations/flavours.js), keyed by the bowl's image.
//   shape: flower | burst | stamp (the site's SVG shapes) or star (a PNG)
//   color: any CSS colour (shapes only) · x, y: where it settles, from the
//   bowl's centre, in bowl widths (negative = left / up) · size: in bowl
//   widths · rot: its resting tilt, in degrees
// ⚠️ PLACEHOLDER ART — these are the brand's generic shapes, tinted for each
// flavour. Real flavour decorations (mango slices, pistachios, chocolate
// pieces…) can replace them: add PNGs to public/ and list them here.
const DECOR_LAYOUTS = [
  // all in the arc above the bowl: there's no room between bowls lower down
  // without covering the neighbours
  [[-0.42, -0.5, 0.42, -12], [0.46, -0.46, 0.36, 14], [-0.6, -0.22, 0.22, 8], [0.08, -0.68, 0.22, -10]],
  [[0.42, -0.52, 0.42, 10], [-0.46, -0.42, 0.36, -8], [0.6, -0.18, 0.22, 18], [-0.1, -0.7, 0.24, -16]],
  [[-0.36, -0.58, 0.4, -6], [0.48, -0.44, 0.34, 12], [-0.6, -0.2, 0.24, 14], [0.14, -0.7, 0.22, -14]],
];
const decor = (layout, items) => DECOR_LAYOUTS[layout].map(([x, y, size, rot], i) => ({ ...items[i], x, y, size, rot }));

export const flavourDecor = {
  "/flavours/web/flavour1.webp": decor(0, [{ shape: "flower", color: "var(--yellow)" }, { shape: "burst", color: "var(--orange)" }, { shape: "star" }, { shape: "flower", color: "var(--peach)" }]), // Alphonso Mango
  "/flavours/web/flavour2.webp": decor(1, [{ shape: "burst", color: "#e8a33d" }, { shape: "flower", color: "var(--peach)" }, { shape: "star" }, { shape: "stamp", color: "var(--orange)" }]), // Butter Scotch
  "/flavours/web/flavour3.webp": decor(2, [{ shape: "flower", color: "var(--mint-soft)" }, { shape: "burst", color: "var(--mint)" }, { shape: "stamp", color: "var(--mint)" }, { shape: "star" }]), // Kesar Pista
  "/flavours/web/flavour4.webp": decor(0, [{ shape: "burst", color: "var(--blue)" }, { shape: "flower", color: "var(--pink)" }, { shape: "flower", color: "var(--pink-soft)" }, { shape: "star" }]), // Double Chocolate
  "/flavours/web/flavour5.png": decor(1, [{ shape: "flower", color: "var(--pink-soft)" }, { shape: "burst", color: "var(--pink)" }, { shape: "star" }, { shape: "flower", color: "var(--yellow)" }]), // Vanilla
  "/flavours/web/flavour6.png": decor(2, [{ shape: "burst", color: "var(--yellow)" }, { shape: "flower", color: "var(--orange)" }, { shape: "stamp", color: "var(--blue)" }, { shape: "star" }]), // Rajbhog
  "/flavours/web/flavour7.png": decor(0, [{ shape: "flower", color: "var(--pink)" }, { shape: "burst", color: "var(--mint-soft)" }, { shape: "star" }, { shape: "stamp", color: "var(--pink)" }]), // Strawberry & Vanilla
  "/flavours/web/flavour8.png": decor(1, [{ shape: "burst", color: "var(--peach)" }, { shape: "flower", color: "var(--mint)" }, { shape: "star" }, { shape: "flower", color: "var(--yellow)" }]), // Tutti Frutti Carnival
};

// The product box shown in the hero and the loader.
// ⚠️ STAND-IN — the only transparent product image supplied carries another
// brand's print; swap in Scoopa packaging when it exists.
export const productImage = { src: "/products/web/ice_cream.webp", size: [392, 361] };

// The ingredients that bounce up from the bottom of the footer
// (animations/ingredients.js). Trimmed, small copies of the originals in
// public/ingredients. scale: drawn size, relative to the others (the photos
// with a glow around them are drawn larger, so the ingredient itself
// matches the rest).
export const ingredients = [
  { src: "/ingredients/web/chocolate-chip.webp", size: [89, 89], scale: 0.75 },
  { src: "/ingredients/web/green-jelly-cube.webp", size: [104, 108], scale: 0.8 },
  { src: "/ingredients/web/red-jelly-cube.webp", size: [96, 89], scale: 0.8 },
  { src: "/ingredients/web/chocolate-cookie-crumb.webp", size: [240, 164], scale: 1.35 },
  { src: "/ingredients/web/waffle-cone-piece.webp", size: [240, 199], scale: 1.35 },
  { src: "/ingredients/web/pistachio-kernel.webp", size: [240, 185], scale: 1.2 },
];

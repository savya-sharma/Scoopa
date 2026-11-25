// Links used by the menu and the footer.

// The menu: the site's pages (app/<page>/page.js), opened with the square
// wipe. Shown in capitals by the menu's styles, so write them normally here.
// (A "#section" href would scroll to that section of the current page instead.)
export const menuLinks = [
  { href: "/about", label: "About" },
  { href: "/flavours", label: "Our Flavours" },
  { href: "/brand-personality", label: "Brand Personality" },
  { href: "/contact", label: "Contact" },
];

// ⚠️ PLACEHOLDER — no social accounts were supplied; set the real URLs
// (and remove any the brand doesn't use)
export const socialLinks = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Facebook", href: "#" },
];

// Footer: two columns of links, then the legal links on their own row
export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Flavours", href: "/flavours" },
  { label: "Contact", href: "/contact" },
];

// ⚠️ PLACEHOLDER — the policy pages don't exist yet
export const legalLinks = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
];

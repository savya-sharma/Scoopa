import "lenis/dist/lenis.css";
import "./globals.css";
import { meta } from "@/data/siteContent";
import PageTransition from "@/components/layout/PageTransition";

export const metadata = {
  title: meta.title,
  description: meta.description,
  icons: { icon: { url: "/logo.svg", type: "image/svg+xml" } },
};

export const viewport = {
  themeColor: "#ff7138", /* the hero's orange (the browser's toolbar on phones) */
};

export default function RootLayout({ children }) {
  return (
    // is-loading: no scrolling until the intro's overlay has wiped away
    // (removed by components/layout/Experience.js, hence suppressHydrationWarning)
    <html lang="en" className="is-loading" suppressHydrationWarning>
      <head>
        {/* The intro waits for the fonts, so start downloading them right away */}
        <link rel="preload" href="/fonts/Bluescreens.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/LilitaOne-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        {/* The square wipe: intro loader and page transitions; stays mounted across pages */}
        <PageTransition />
      </body>
    </html>
  );
}

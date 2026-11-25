import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import Experience from "@/components/layout/Experience";
import { siteContent } from "@/data/siteContent";

// A page not built yet: just its name, centred, with the header and menu
// (to get around) and Experience (smooth scrolling and the header's
// entrance, animations/pageIntro.js). Styles: app/styles/layout/placeholder.css
//   page: which page (a key of siteContent.pages, data/siteContent.js)
export default function PagePlaceholder({ page }) {
  return (
    <>
      <Header />
      <Menu />
      <main className="placeholder">
        <h1 className="placeholder-title" data-split="chars">{siteContent.pages[page].meta}</h1>
      </main>
      <Experience />
    </>
  );
}

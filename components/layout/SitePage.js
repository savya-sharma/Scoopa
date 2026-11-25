import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import Experience from "@/components/layout/Experience";
import { ShapeDefs } from "@/components/ui/Shapes";

// The frame every inner page shares: header, menu, the page's own content,
// the footer, and Experience (which starts all animation). The homepage
// (app/page.js) lays these out itself, around its hero.
//   contactForm: show the footer's contact form (the Contact page)
export default function SitePage({ children, contactForm = false }) {
  return (
    <>
      <ShapeDefs />
      <Header />
      <Menu />
      <main>{children}</main>
      <Footer contactForm={contactForm} />
      <Experience />
    </>
  );
}

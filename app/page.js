import Header from "@/components/layout/Header";
import Menu from "@/components/layout/Menu";
import Footer from "@/components/layout/Footer";
import Experience from "@/components/layout/Experience";
import Hero from "@/components/sections/Hero";
import Flavours from "@/components/sections/Flavours";
import BrandPersonality from "@/components/sections/BrandPersonality";
import OurStory from "@/components/sections/OurStory";
import { ShapeDefs } from "@/components/ui/Shapes";

// The homepage. Copy: data/siteContent.js · links: data/navigation.js ·
// flavours and product images: data/products.js · animations: animations/
export default function Home() {
  return (
    <>
      <ShapeDefs />
      <Header />
      <Menu />
      <main>
        <Hero />
        <Flavours />
        {/* Sections sized from this wrapper's width (container units) */}
        <div className="journey">
          <BrandPersonality />
          <OurStory />
        </div>
      </main>
      <Footer />
      {/* Runs the loader, intro and menu animations once the markup is on the page */}
      <Experience />
    </>
  );
}

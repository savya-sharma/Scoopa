import PagePlaceholder from "@/components/layout/PagePlaceholder";
import { brand, siteContent } from "@/data/siteContent";

const copy = siteContent.pages.about;

export const metadata = {
  title: `${copy.meta} | ${brand.name}`,
  description: copy.intro,
};

// About: not built yet, just its name
export default function About() {
  return <PagePlaceholder page="about" />;
}

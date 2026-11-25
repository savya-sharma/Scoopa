import PagePlaceholder from "@/components/layout/PagePlaceholder";
import { brand, siteContent } from "@/data/siteContent";

const copy = siteContent.pages.personality;

export const metadata = {
  title: `${copy.meta} | ${brand.name}`,
  description: copy.intro,
};

// Brand Personality: not built yet, just its name
export default function BrandPersonalityPage() {
  return <PagePlaceholder page="personality" />;
}

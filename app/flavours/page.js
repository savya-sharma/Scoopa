import PagePlaceholder from "@/components/layout/PagePlaceholder";
import { brand, siteContent } from "@/data/siteContent";

const copy = siteContent.pages.flavours;

export const metadata = {
  title: `${copy.meta} | ${brand.name}`,
  description: copy.intro,
};

// Our Flavours: not built yet, just its name
export default function FlavoursPage() {
  return <PagePlaceholder page="flavours" />;
}

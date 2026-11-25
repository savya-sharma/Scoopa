import PagePlaceholder from "@/components/layout/PagePlaceholder";
import { brand, siteContent } from "@/data/siteContent";

const copy = siteContent.pages.contact;

export const metadata = {
  title: `${copy.meta} | ${brand.name}`,
  description: copy.intro,
};

// Contact: not built yet, just its name
export default function ContactPage() {
  return <PagePlaceholder page="contact" />;
}

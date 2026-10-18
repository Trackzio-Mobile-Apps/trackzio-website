import Home from "@/screens/Index";
import PageSeo from "@/components/PageSeo";
import JsonLd from "@/components/JsonLd";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, websiteJsonLd } from "@/lib/seo";

export default function Page() {
  return (
    <>
      <PageSeo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} path="/" />
      <JsonLd data={websiteJsonLd()} />
      <Home />
    </>
  );
}

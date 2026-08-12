import Home from "@/screens/Index";
import PageSeo from "@/components/PageSeo";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "@/lib/seo";

export default function Page() {
  return (
    <>
      <PageSeo title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} path="/" />
      <Home />
    </>
  );
}

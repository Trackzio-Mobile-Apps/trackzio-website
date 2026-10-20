import type { GetServerSideProps } from "next";
import Head from "next/head";
import Partners from "@/screens/Partners";
import PageSeo from "@/components/PageSeo";
import JsonLd from "@/components/JsonLd";
import { categoryFromQuery, PARTNER_FAQS } from "@/lib/partnerForm";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo";

const TITLE = "Trackzio Partner Network: Shops, Dealers and Experts for Collectors";
const DESCRIPTION =
  "Join the Trackzio Partner Network. List for free, reach collectors across Coinzy, Banknote, Antiqzy, Rockzy and our next apps, or join our expert panel.";

type PageProps = {
  initialCategory: string;
};

export default function Page({ initialCategory }: PageProps) {
  return (
    <>
      <PageSeo title={TITLE} description={DESCRIPTION} path="/partners" ogImage="/og/partners.png" />
      <Head>
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
      </Head>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Partners", path: "/partners" },
          ]),
          faqPageJsonLd([...PARTNER_FAQS]),
        ]}
      />
      <Partners initialCategory={initialCategory} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const raw = context.query.category;
  const value = typeof raw === "string" ? raw : "";
  return {
    props: {
      initialCategory: categoryFromQuery(value) ?? "",
    },
  };
};

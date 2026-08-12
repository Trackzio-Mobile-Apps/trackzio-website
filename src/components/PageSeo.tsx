import Head from "next/head";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
} from "@/lib/seo";

type PageSeoProps = {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
};

/** Per-page Head tags for Pages Router routes. */
export default function PageSeo({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
}: PageSeoProps) {
  const canonical = absoluteUrl(path);
  const image = absoluteUrl(ogImage);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{title === DEFAULT_TITLE ? DEFAULT_TITLE : fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title === DEFAULT_TITLE ? DEFAULT_TITLE : fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title === DEFAULT_TITLE ? DEFAULT_TITLE : fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}

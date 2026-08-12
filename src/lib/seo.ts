export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://trackzio.com";

export const SITE_NAME = "Trackzio";
export const DEFAULT_TITLE = "Trackzio — AI-Powered Apps for Curious Minds";
export const DEFAULT_DESCRIPTION =
  "Trackzio builds intelligent mobile apps that bridge curiosity and clarity through AI. Explore Coinzy, Banknotes, Insecto, Habiteazy, and more.";

/** Interim social share image until a dedicated 1200×630 OG asset is added. */
export const DEFAULT_OG_IMAGE = "/favicon.png";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function truncateDescription(text: string, max = 155): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  const sliced = cleaned.slice(0, max - 1);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > 40 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}…`;
}

export function metaDescriptionFromApp(tagline: string, longDescription: string): string {
  const combined = tagline ? `${tagline}. ${longDescription}` : longDescription;
  return truncateDescription(combined);
}

type FaqItem = { q: string; a: string };

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(DEFAULT_OG_IMAGE),
    email: "developer@trackzio.com",
    sameAs: [],
  };
}

export function softwareApplicationJsonLd(input: {
  name: string;
  description: string;
  url: string;
  iosUrl: string | null;
  androidUrl: string | null;
  rating?: string;
}) {
  const offers: Array<Record<string, unknown>> = [];
  if (input.iosUrl) {
    offers.push({
      "@type": "Offer",
      url: input.iosUrl,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    });
  }
  if (input.androidUrl) {
    offers.push({
      "@type": "Offer",
      url: input.androidUrl,
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    });
  }

  const ratingValue = input.rating?.replace(/[^0-9.]/g, "");
  const aggregateRating =
    ratingValue && Number(ratingValue) > 0
      ? {
          "@type": "AggregateRating",
          ratingValue,
          bestRating: "5",
          ratingCount: "1",
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    applicationCategory: "LifestyleApplication",
    operatingSystem: [input.iosUrl && "iOS", input.androidUrl && "Android"]
      .filter(Boolean)
      .join(", "),
    offers: offers.length === 1 ? offers[0] : offers.length > 1 ? offers : undefined,
    aggregateRating,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function faqPageJsonLd(faqs: FaqItem[]) {
  if (!faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  author: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: [absoluteUrl(input.image)],
    datePublished: input.datePublished,
    author: {
      "@type": "Person",
      name: input.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    mainEntityOfPage: absoluteUrl(input.url),
  };
}

export function jsonLdScript(data: unknown | unknown[]): string {
  const payload = Array.isArray(data) ? data.filter(Boolean) : data;
  return JSON.stringify(payload);
}

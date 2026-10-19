export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://trackzio.com";

export const SITE_NAME = "Trackzio";
export const DEFAULT_TITLE = "Trackzio — Digital Platforms for Collectibles & Hobbies";
export const DEFAULT_DESCRIPTION =
  "Trackzio builds intelligent tools that help people identify, understand, organize, and exchange the things they care about.";

export const PUBLIC_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

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

export function contentImageUrl(src: string | { src: string }): string {
  const value = typeof src === "string" ? src : src.src;
  return absoluteUrl(value);
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/trackzio-logo.svg"),
    email: "developer@trackzio.com",
    sameAs: [],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

function reviewDate(date?: string): string | undefined {
  if (!date || !/\d{4}/.test(date)) return undefined;
  const parsed = Date.parse(date);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}

export function softwareApplicationJsonLd(input: {
  name: string;
  description: string;
  url: string;
  iosUrl: string | null;
  androidUrl: string | null;
  rating?: string;
  image?: string;
  screenshots?: string[];
  featureList?: string[];
  reviews?: { quote: string; author: string; rating?: number; title?: string; date?: string }[];
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
  const numericRating = ratingValue ? Number(ratingValue) : NaN;
  const aggregateRating =
    numericRating >= 1 && numericRating <= 5
      ? {
          "@type": "AggregateRating",
          ratingValue,
          bestRating: "5",
          ratingCount: "1",
        }
      : undefined;

  const reviews = input.reviews?.slice(0, 8).map((review) => ({
    "@type": "Review",
    name: review.title,
    reviewBody: review.quote,
    datePublished: reviewDate(review.date),
    author: { "@type": "Person", name: review.author },
    reviewRating: review.rating
      ? {
          "@type": "Rating",
          ratingValue: String(review.rating),
          bestRating: "5",
        }
      : undefined,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    image: input.image,
    screenshot: input.screenshots?.length ? input.screenshots : undefined,
    featureList: input.featureList?.length ? input.featureList : undefined,
    applicationCategory: "LifestyleApplication",
    operatingSystem: [input.iosUrl && "iOS", input.androidUrl && "Android"]
      .filter(Boolean)
      .join(", "),
    isAccessibleForFree: true,
    offers: offers.length === 1 ? offers[0] : offers.length > 1 ? offers : undefined,
    aggregateRating,
    review: reviews?.length ? reviews : undefined,
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

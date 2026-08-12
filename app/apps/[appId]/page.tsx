import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppDetail from "@/screens/AppDetail";
import JsonLd from "@/components/JsonLd";
import { getApp, getApps } from "@/lib/content/apps";
import {
  DEFAULT_OG_IMAGE,
  faqPageJsonLd,
  metaDescriptionFromApp,
  softwareApplicationJsonLd,
} from "@/lib/seo";

type Props = { params: { appId: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getApps().map((app) => ({ appId: app.id }));
}

export function generateMetadata({ params }: Props): Metadata {
  const app = getApp(params.appId);
  if (!app) {
    return {
      title: "App not found",
      robots: { index: false, follow: false },
    };
  }

  const description = metaDescriptionFromApp(app.tagline, app.longDescription);
  const path = `/apps/${app.id}`;

  return {
    title: app.fullName,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: app.fullName,
      description,
      type: "website",
      url: path,
      images: [{ url: DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: app.fullName,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default function AppDetailsPage({ params }: Props) {
  const app = getApp(params.appId);
  if (!app) notFound();

  const description = metaDescriptionFromApp(app.tagline, app.longDescription);
  const path = `/apps/${app.id}`;
  const jsonLd = [
    softwareApplicationJsonLd({
      name: app.fullName,
      description,
      url: path,
      iosUrl: app.iosUrl,
      androidUrl: app.androidUrl,
      rating: app.stats.rating,
    }),
    faqPageJsonLd(app.faqs),
  ].filter(Boolean);

  return (
    <>
      <JsonLd data={jsonLd} />
      <AppDetail app={app} />
    </>
  );
}

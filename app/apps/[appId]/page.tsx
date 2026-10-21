import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppDetail from "@/screens/AppDetail";
import JsonLd from "@/components/JsonLd";
import { getApp, getApps, type AppContent } from "@/lib/content/apps";
import {
  breadcrumbJsonLd,
  contentImageUrl,
  DEFAULT_OG_IMAGE,
  faqPageJsonLd,
  metaDescriptionFromApp,
  PUBLIC_ROBOTS,
  SITE_NAME,
  softwareApplicationJsonLd,
} from "@/lib/seo";

function publicFileExists(publicPath: string): boolean {
  const rel = publicPath.replace(/^\//, "");
  return fs.existsSync(path.join(process.cwd(), "public", rel));
}

function withPublishedReviewShots(app: AppContent): AppContent {
  return {
    ...app,
    reviewScreenshots: (app.reviewScreenshots ?? []).filter((shot) => publicFileExists(shot.image)),
  };
}

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

  const description = app.seoDescription ?? metaDescriptionFromApp(app.tagline, app.longDescription);
  const title = app.seoTitle ?? app.fullName;
  const socialTitle = app.seoTitle ? `${app.seoTitle} | ${SITE_NAME}` : title;
  const path = `/apps/${app.id}`;
  const ogImage = app.ogImage && publicFileExists(app.ogImage) ? app.ogImage : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: socialTitle,
      description,
      type: "website",
      url: path,
      images: [{ url: ogImage, alt: socialTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
    robots: PUBLIC_ROBOTS,
  };
}

export default function AppDetailsPage({ params }: Props) {
  const found = getApp(params.appId);
  if (!found) notFound();
  const app = withPublishedReviewShots(found);

  const description = app.seoDescription ?? metaDescriptionFromApp(app.tagline, app.longDescription);
  const path = `/apps/${app.id}`;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: app.seoTitle ?? app.fullName, path },
    ]),
    softwareApplicationJsonLd({
      name: app.seoTitle ?? app.fullName,
      description,
      url: path,
      iosUrl: app.iosUrl,
      androidUrl: app.androidUrl,
      image: contentImageUrl(app.logo),
      screenshots: app.screenshots.slice(0, 4).map((shot) => contentImageUrl(shot)),
      featureList: app.features,
      reviews: app.reviews,
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

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AppDetail from "@/screens/AppDetail";
import { getApp, getApps } from "@/lib/content/apps";

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

  return {
    title: `${app.name} | Trackzio`,
    description: app.longDescription,
    alternates: { canonical: `/apps/${app.id}` },
    openGraph: {
      title: `${app.name} | Trackzio`,
      description: app.longDescription,
      type: "website",
      url: `/apps/${app.id}`,
    },
  };
}

export default function AppDetailsPage({ params }: Props) {
  const app = getApp(params.appId);
  if (!app) notFound();
  return <AppDetail app={app} />;
}

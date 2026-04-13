import type { GetStaticPaths, GetStaticProps } from "next";
import AppDetail from "@/screen-pages/AppDetail";
import { getApp } from "@/lib/appData";
import { getApps } from "@/lib/content/apps";
import type { AppInfo } from "@/lib/appData";

interface AppDetailPageProps {
  app: AppInfo;
}

export default function AppDetailPage({ app }: AppDetailPageProps) {
  return <AppDetail app={app} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apps = getApps();
  return {
    paths: apps.map((a) => ({ params: { appId: a.id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<AppDetailPageProps> = async ({ params }) => {
  const appId = typeof params?.appId === "string" ? params.appId : "";
  const app = getApp(appId);
  if (!app) {
    return { notFound: true };
  }
  return { props: { app } };
};

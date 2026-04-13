import type { GetStaticPaths } from "next";
import AppDetail from "@/screens/AppDetail";
import { apps } from "@/lib/appData";

export default function AppDetailPage() {
  return <AppDetail />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: apps.map((a) => ({ params: { appId: a.id } })),
  fallback: false,
});

export async function getStaticProps() {
  return { props: {} };
}

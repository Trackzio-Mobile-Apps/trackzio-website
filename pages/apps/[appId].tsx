import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import AppDetail from "@/screens/AppDetail";
import { apps } from "@/lib/appData";

type PageProps = { appId: string };

export default function AppDetailPage({ appId }: InferGetStaticPropsType<typeof getStaticProps>) {
  return <AppDetail appId={appId} />;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: apps.map((a) => ({ params: { appId: a.id } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const appId = params?.appId;
  if (typeof appId !== "string") return { notFound: true };
  return { props: { appId } };
};

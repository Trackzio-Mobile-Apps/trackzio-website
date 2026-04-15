import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import AppLegalDocument from "@/screens/AppLegalDocument";
import type { LegalPageDoc } from "@/lib/content/legalPageTypes";
import { getDynamicLegalAppIds } from "@/lib/content/appLegal.server";
import { getAppLegalStaticProps } from "@/lib/getAppLegalStaticProps";

export const getStaticPaths: GetStaticPaths = async () => {
  const appIds = getDynamicLegalAppIds();
  return {
    paths: appIds.map((appId) => ({ params: { appId } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ doc: LegalPageDoc }> = async (ctx) => {
  const appId = String(ctx.params?.appId ?? "");
  return getAppLegalStaticProps(appId, "terms")(ctx);
};

const Page: NextPage<{ doc: LegalPageDoc }> = ({ doc }) => <AppLegalDocument doc={doc} />;
export default Page;

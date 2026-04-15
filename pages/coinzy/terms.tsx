import type { GetStaticProps, NextPage } from "next";
import AppLegalDocument from "@/screens/AppLegalDocument";
import type { LegalPageDoc } from "@/lib/content/legalPageTypes";
import { getAppLegalStaticProps } from "@/lib/getAppLegalStaticProps";

export const getStaticProps = getAppLegalStaticProps("coinzy", "terms");

const Page: NextPage<{ doc: LegalPageDoc }> = ({ doc }) => <AppLegalDocument doc={doc} />;
export default Page;

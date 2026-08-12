import type { Metadata } from "next";
import AccountDataDeletion from "@/screens/AccountDataDeletion";

export const metadata: Metadata = {
  title: "Account & Data Deletion",
  description: "Request deletion of your Trackzio account and associated data.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <AccountDataDeletion />;
}

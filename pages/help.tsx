import Help from "@/screens/Help";
import PageSeo from "@/components/PageSeo";

export default function Page() {
  return (
    <>
      <PageSeo
        title="Help & Support"
        description="Get help with Trackzio apps. Find answers to common questions and contact support at developer@trackzio.com."
        path="/help"
      />
      <Help />
    </>
  );
}

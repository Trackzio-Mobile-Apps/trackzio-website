import Privacy from "@/screens/Privacy";
import PageSeo from "@/components/PageSeo";

export default function Page() {
  return (
    <>
      <PageSeo
        title="Privacy Policy"
        description="Trackzio privacy policy — how we collect, use, and protect your personal information across our apps and website."
        path="/privacy"
      />
      <Privacy />
    </>
  );
}

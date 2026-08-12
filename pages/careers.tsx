import Careers from "@/screens/Careers";
import PageSeo from "@/components/PageSeo";

export default function Page() {
  return (
    <>
      <PageSeo
        title="Careers"
        description="Join Trackzio. Explore open roles and help build AI-powered mobile apps that make everyday curiosity clearer."
        path="/careers"
      />
      <Careers />
    </>
  );
}

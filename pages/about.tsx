import About from "@/screens/About";
import PageSeo from "@/components/PageSeo";

export default function Page() {
  return (
    <>
      <PageSeo
        title="About"
        description="Learn about Trackzio — the team building AI-powered identification and productivity apps for curious minds."
        path="/about"
      />
      <About />
    </>
  );
}

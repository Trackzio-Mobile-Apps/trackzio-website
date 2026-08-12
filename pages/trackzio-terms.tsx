import TrackzioTerms from "@/screens/TrackzioTerms";
import PageSeo from "@/components/PageSeo";

export default function Page() {
  return (
    <>
      <PageSeo
        title="Terms of Service"
        description="Trackzio terms of service for our website and apps. Read the rules that govern your use of Trackzio products."
        path="/trackzio-terms"
      />
      <TrackzioTerms />
    </>
  );
}

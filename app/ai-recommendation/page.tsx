import { AIRecommendation } from "@/components/AIRecommendation";

export const metadata = {
  title: "AI Recommendation"
};

export default function AIRecommendationPage() {
  return (
    <section className="container-px section-y">
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">AI Recommendation</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Choose smarter print settings before production.</h1>
        <p className="mt-4 text-forge-steel">The API uses secure server-side logic and never exposes AI keys in the browser.</p>
      </div>
      <AIRecommendation />
    </section>
  );
}

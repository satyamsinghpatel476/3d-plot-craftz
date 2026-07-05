import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "About Us"
};

export default function AboutPage() {
  return (
    <section className="container-px section-y">
      <p className="eyebrow">About Us</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-5xl">{siteConfig.brand} helps makers, students, and businesses turn files into usable parts.</h1>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {[
          ["Production mindset", "The site supports real auth, storage, orders, payments, uploads, admin review, and customer support."],
          ["Material guidance", "Print recommendations help choose PLA, PETG, ABS, TPU, or Resin for the part's purpose."],
          ["Built to scale", "The project is designed for Vercel, Supabase, and Razorpay with environment-driven configuration."]
        ].map(([title, description]) => (
          <article key={title} className="surface rounded-md p-6">
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-3 text-forge-steel">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

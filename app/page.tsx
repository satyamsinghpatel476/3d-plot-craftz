import Link from "next/link";
import { ArrowRight, BrainCircuit, Calculator, CheckCircle2, Cog, CreditCard, ShieldCheck, UploadCloud } from "lucide-react";
import { GalleryGrid } from "@/components/GalleryGrid";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { getGalleryItems, getProducts } from "@/lib/data";
import { categories, materials, siteConfig } from "@/lib/siteConfig";

const serviceCards = [
  { icon: Cog, title: "Custom 3D Printing", description: "Functional parts, replacement components, enclosures, jigs, fixtures, and prototypes." },
  { icon: BrainCircuit, title: "AI Print Recommendation", description: "Material, infill, support, risk, and STL improvement suggestions from a secure API route." },
  { icon: CreditCard, title: "Shop and Checkout", description: "Products, cart, orders, Razorpay payment creation, and server-side signature verification." }
];

const whyCards = [
  { icon: ShieldCheck, title: "Secure backend", description: "Supabase Auth, RLS policies, server-side payment verification, and protected admin routes." },
  { icon: Calculator, title: "Transparent pricing", description: "Editable pricing logic for material, time, weight, density, finish, urgency, quantity, and taxes." },
  { icon: UploadCloud, title: "Production operations", description: "Uploads, tickets, orders, reviews, payments, products, gallery, and analytics in one dashboard." }
];

export default async function HomePage() {
  const [products, galleryItems] = await Promise.all([getProducts(), getGalleryItems()]);

  return (
    <>
      <Hero />

      <section className="section-y bg-white dark:bg-forge-ink">
        <div className="container-px grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow">Start with a file</p>
            <h2 className="mt-3 text-4xl font-black">Upload an STL and get a print-ready estimate.</h2>
            <p className="mt-4 text-forge-steel">Choose material, color, hollow or solid density, infill, urgency, quantity, and finishing. The quote updates with a transparent pricing formula.</p>
            <Link href="/upload" className="btn-primary mt-7">
              <UploadCloud className="h-4 w-4" />
              Upload STL
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Material choice", "PLA, PETG, ABS, TPU, and Resin rates are configurable."],
              ["Density control", "Hollow, solid, and custom infill from 10% to 100%."],
              ["File storage", "STL uploads are stored in Supabase Storage with metadata."],
              ["Quote history", "Uploaded models are saved for dashboard and admin review."]
            ].map(([title, description]) => (
              <div key={title} className="rounded-md border border-black/10 p-5 dark:border-white/10">
                <CheckCircle2 className="h-5 w-5 text-forge-mint" />
                <h3 className="mt-4 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-forge-steel">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="section-y bg-forge-panel dark:bg-white/[0.03]">
        <div className="container-px">
          <div className="max-w-2xl">
            <p className="eyebrow">Services</p>
            <h2 className="mt-3 text-4xl font-black">From prototype to finished product.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {serviceCards.map(({ icon: Icon, title, description }) => (
              <article key={title} className="rounded-md bg-white p-6 shadow-soft dark:bg-white/[0.06]">
                <Icon className="h-7 w-7 text-forge-mint" />
                <h3 className="mt-5 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-forge-steel">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-px grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">AI highlight</p>
            <h2 className="mt-3 text-4xl font-black">Recommendation logic that works before an AI key exists.</h2>
            <p className="mt-4 text-forge-steel">Decorative objects get PLA, hollow shells, and low infill. Robotics and load-bearing parts move toward PETG or ABS with higher infill. Flexible objects route to TPU. The provider layer is ready for Gemini or OpenAI via server-only environment variables.</p>
            <Link href="/ai-recommendation" className="btn-secondary mt-7">
              <BrainCircuit className="h-4 w-4" />
              Try recommendation
            </Link>
          </div>
          <div className="rounded-md bg-forge-ink p-6 text-white dark:bg-white dark:text-forge-ink">
            <div className="grid gap-4">
              {["Recommended material", "Infill percentage", "Support structure", "Risk warning", "Cost-saving suggestion", "STL improvement"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-md border border-white/10 p-3 dark:border-black/10">
                  <span>{item}</span>
                  <CheckCircle2 className="h-4 w-4 text-forge-mint" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y bg-white dark:bg-forge-ink">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Shop preview</p>
              <h2 className="mt-3 text-4xl font-black">Products for makers and teams.</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 font-semibold text-forge-mint">
              View shop <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-y bg-forge-panel dark:bg-white/[0.03]">
        <div className="container-px">
          <p className="eyebrow">Categories</p>
          <h2 className="mt-3 text-4xl font-black">Everything organized by use case.</h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category} href={`/categories?name=${encodeURIComponent(category)}`} className="rounded-md border border-black/10 bg-white p-4 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-forge-mint hover:text-forge-mint dark:border-white/10 dark:bg-white/[0.06]">
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-px">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Work gallery</p>
              <h2 className="mt-3 text-4xl font-black">Recent printed work.</h2>
            </div>
            <Link href="/gallery" className="inline-flex items-center gap-2 font-semibold text-forge-mint">
              Open gallery <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10">
            <GalleryGrid items={galleryItems.slice(0, 3)} />
          </div>
        </div>
      </section>

      <section className="section-y bg-white dark:bg-forge-ink">
        <div className="container-px grid gap-8 lg:grid-cols-3">
          <div>
            <p className="eyebrow">Why choose us</p>
            <h2 className="mt-3 text-4xl font-black">A full workflow, not a contact form.</h2>
          </div>
          {whyCards.map(({ icon: Icon, title, description }) => (
            <div key={title} className="rounded-md border border-black/10 p-5 dark:border-white/10">
              <Icon className="h-6 w-6 text-forge-mint" />
              <h3 className="mt-4 text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-forge-steel">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y bg-forge-ink text-white dark:bg-white dark:text-forge-ink">
        <div className="container-px grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 className="mt-3 text-4xl font-black">Material plus machine time plus finishing.</h2>
            <p className="mt-4 text-white/70 dark:text-forge-steel">The calculator is intentionally readable in `lib/priceCalculator.ts`, so rates can be changed without hunting through UI code.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {materials.map((material) => (
              <div key={material.id} className="rounded-md border border-white/10 p-4 dark:border-black/10">
                <p className="font-bold">{material.label}</p>
                <p className="mt-1 text-sm opacity-75">From ₹{material.ratePerGram}/g · {material.bestFor}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-px text-center">
          <p className="eyebrow">Contact</p>
          <h2 className="mt-3 text-4xl font-black">Ready to forge your next part?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-forge-steel">Send files, order products, or ask for help at {siteConfig.email} or {siteConfig.phone}.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/upload" className="btn-primary">Upload STL</Link>
            <Link href="/contact" className="btn-secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

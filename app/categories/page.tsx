import Link from "next/link";
import { categories } from "@/lib/siteConfig";

export const metadata = {
  title: "Categories"
};

export default function CategoriesPage() {
  return (
    <section className="container-px section-y">
      <p className="eyebrow">Categories</p>
      <h1 className="mt-3 text-4xl font-black sm:text-5xl">Shop by print category.</h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="rounded-md border border-black/10 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-forge-mint hover:shadow-lift dark:border-white/10 dark:bg-white/[0.06]">
            <h2 className="text-xl font-bold">{category}</h2>
            <p className="mt-3 text-sm leading-6 text-forge-steel">Browse products, parts, and printable objects under {category.toLowerCase()}.</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

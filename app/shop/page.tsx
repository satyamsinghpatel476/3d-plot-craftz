import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/data";
import { categories } from "@/lib/siteConfig";

export const metadata = {
  title: "Shop"
};

export default async function ShopPage({ searchParams }: { searchParams?: { category?: string } }) {
  const products = await getProducts();
  const selectedCategory = searchParams?.category;
  const visibleProducts = selectedCategory ? products.filter((product) => product.category === selectedCategory) : products;

  return (
    <section className="container-px section-y">
      <div className="max-w-3xl">
        <p className="eyebrow">Shop</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">3D printers, filament, STL objects, and custom parts.</h1>
        <p className="mt-4 text-forge-steel">Browse ready-made products and add them to cart for Razorpay or COD checkout.</p>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/shop" className="rounded-md border border-black/10 px-3 py-2 text-sm font-semibold hover:border-forge-mint hover:text-forge-mint dark:border-white/10">
          All
        </Link>
        {categories.map((category) => (
          <Link key={category} href={`/shop?category=${encodeURIComponent(category)}`} className="rounded-md border border-black/10 px-3 py-2 text-sm font-semibold hover:border-forge-mint hover:text-forge-mint dark:border-white/10">
            {category}
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ReviewSection } from "@/components/ReviewSection";
import { getProductByIdOrSlug, getProducts } from "@/lib/data";

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, products] = await Promise.all([getProductByIdOrSlug(params.id), getProducts()]);
  if (!product) notFound();

  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 4);

  return (
    <>
      <section className="container-px section-y">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="grid gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-black/10 bg-forge-panel dark:border-white/10 dark:bg-white/10">
              <Image src={product.image_url || "/assets/hero-3d-printing.png"} alt={product.name} fill priority className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="relative aspect-[4/3] overflow-hidden rounded-md border border-black/10 bg-forge-panel dark:border-white/10">
                  <Image src={product.image_url || "/assets/hero-3d-printing.png"} alt={`${product.name} view ${item}`} fill className="object-cover" sizes="160px" />
                </div>
              ))}
            </div>
          </div>
          <ProductPurchasePanel product={product} />
        </div>
      </section>

      <ReviewSection productId={product.id} />

      <section className="container-px section-y">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Related</p>
            <h2 className="mt-3 text-3xl font-black">More from {product.category}</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(related.length ? related : products.slice(0, 4)).map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </>
  );
}

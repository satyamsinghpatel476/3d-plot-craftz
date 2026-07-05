"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <article className="group overflow-hidden rounded-md border border-black/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-white/[0.06]">
      <Link href={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-forge-panel dark:bg-white/10">
        <Image src={product.image_url || "/assets/hero-3d-printing.png"} alt={product.name} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
      </Link>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-md bg-forge-mint/12 px-2 py-1 text-xs font-semibold text-forge-mint">{product.category}</span>
          <span className="inline-flex items-center gap-1 text-xs text-forge-steel">
            <Star className="h-3.5 w-3.5 fill-forge-amber text-forge-amber" />
            {product.rating ?? 4.6}
          </span>
        </div>
        <h2 className="line-clamp-2 min-h-12 text-base font-bold">{product.name}</h2>
        <p className="mt-2 line-clamp-2 min-h-10 text-sm text-forge-steel">{product.short_description ?? product.description}</p>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-forge-steel">{product.material} · {product.color}</p>
            <p className="text-xl font-black">{formatCurrency(product.price)}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/product/${product.id}`} className="grid h-10 w-10 place-items-center rounded-md border border-black/10 transition hover:border-forge-mint hover:text-forge-mint dark:border-white/15" aria-label={`View ${product.name}`} title="View details">
              <Eye className="h-4 w-4" />
            </Link>
            <button type="button" onClick={() => addItem(product)} className="grid h-10 w-10 place-items-center rounded-md bg-forge-ink text-white transition hover:bg-forge-mint hover:text-forge-ink dark:bg-white dark:text-forge-ink" aria-label={`Add ${product.name} to cart`} title="Add to cart">
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

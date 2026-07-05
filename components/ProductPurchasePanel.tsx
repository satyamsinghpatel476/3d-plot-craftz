"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { printColors } from "@/lib/siteConfig";
import type { Product, PrintColor } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export function ProductPurchasePanel({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState<PrintColor>((product.color as PrintColor) || "White");

  const selectedProduct = { ...product, color };

  function addToCart() {
    addItem(selectedProduct, quantity);
  }

  function buyNow() {
    addItem(selectedProduct, quantity);
    router.push("/checkout");
  }

  return (
    <div className="surface rounded-md p-5 sm:p-6">
      <p className="text-sm font-semibold text-forge-mint">{product.category}</p>
      <h1 className="mt-2 text-3xl font-black sm:text-4xl">{product.name}</h1>
      <p className="mt-4 text-forge-steel">{product.description}</p>
      <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-black/10 p-3 dark:border-white/10">
          <p className="text-forge-steel">Material</p>
          <p className="font-semibold">{product.material}</p>
        </div>
        <div className="rounded-md border border-black/10 p-3 dark:border-white/10">
          <p className="text-forge-steel">Dimensions</p>
          <p className="font-semibold">{product.dimensions ?? "Custom sizing available"}</p>
        </div>
        <div className="rounded-md border border-black/10 p-3 dark:border-white/10">
          <p className="text-forge-steel">Stock</p>
          <p className="font-semibold">{product.stock} available</p>
        </div>
        <div className="rounded-md border border-black/10 p-3 dark:border-white/10">
          <p className="text-forge-steel">Rating</p>
          <p className="font-semibold">{product.rating ?? 4.6}/5</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="label">Color options</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {printColors.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              title={swatch.label}
              aria-label={swatch.label}
              onClick={() => setColor(swatch.id)}
              className={`h-9 w-9 rounded-md border ${color === swatch.id ? "border-forge-mint ring-2 ring-forge-mint/25" : "border-black/10 dark:border-white/15"}`}
              style={{ background: swatch.value }}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-forge-steel">Price</p>
          <p className="text-3xl font-black">{formatCurrency(product.price)}</p>
        </div>
        <div className="flex h-11 items-center rounded-md border border-black/10 dark:border-white/10">
          <button type="button" aria-label="Decrease quantity" className="px-3" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
            <Minus className="h-4 w-4" />
          </button>
          <span className="min-w-10 text-center font-bold">{quantity}</span>
          <button type="button" aria-label="Increase quantity" className="px-3" onClick={() => setQuantity((value) => value + 1)}>
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={addToCart} className="btn-secondary">
          <ShoppingCart className="h-4 w-4" />
          Add to cart
        </button>
        <button type="button" onClick={buyNow} className="btn-primary">
          <Zap className="h-4 w-4" />
          Buy now
        </button>
      </div>
      <Link href="/upload" className="mt-4 inline-flex text-sm font-semibold text-forge-mint">
        Need a custom print instead?
      </Link>
    </div>
  );
}

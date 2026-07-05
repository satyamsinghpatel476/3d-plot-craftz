"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/utils";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <section className="container-px section-y">
      <p className="eyebrow">Cart</p>
      <h1 className="mt-3 text-4xl font-black">Review your order.</h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-black/15 p-10 text-center dark:border-white/15">
              <ShoppingCart className="mx-auto h-12 w-12 text-forge-steel" />
              <p className="mt-4 text-forge-steel">Your cart is empty.</p>
              <Link href="/shop" className="btn-primary mt-6">Go to shop</Link>
            </div>
          ) : (
            items.map((line) => (
              <article key={line.product.id} className="grid gap-4 rounded-md border border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-white/[0.06] sm:grid-cols-[120px_1fr_auto]">
                <div className="relative aspect-square overflow-hidden rounded-md bg-forge-panel dark:bg-white/10">
                  <Image src={line.product.image_url || "/assets/hero-3d-printing.png"} alt={line.product.name} fill className="object-cover" sizes="120px" />
                </div>
                <div>
                  <h2 className="font-bold">{line.product.name}</h2>
                  <p className="mt-1 text-sm text-forge-steel">{line.product.material} · {line.product.color}</p>
                  <p className="mt-3 text-lg font-black">{formatCurrency(line.product.price)}</p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <div className="flex h-10 items-center rounded-md border border-black/10 dark:border-white/10">
                    <button className="px-3" aria-label="Decrease quantity" onClick={() => updateQuantity(line.product.id, line.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center font-bold">{line.quantity}</span>
                    <button className="px-3" aria-label="Increase quantity" onClick={() => updateQuantity(line.product.id, line.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-forge-coral" onClick={() => removeItem(line.product.id)}>
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        <aside className="surface h-fit rounded-md p-5">
          <h2 className="text-xl font-bold">Summary</h2>
          <div className="mt-5 flex justify-between text-sm text-forge-steel">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-3 flex justify-between text-lg font-black">
            <span>Total</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Checkout
          </Link>
        </aside>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { formatCurrency } from "@/lib/utils";

export function CartDrawer() {
  const { items, isOpen, closeCart, subtotal, updateQuantity, removeItem } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button className="absolute inset-0 bg-black/40" aria-label="Close cart" onClick={closeCart} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift dark:bg-forge-ink">
        <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
          <div className="flex items-center gap-2 font-semibold">
            <ShoppingBag className="h-5 w-5 text-forge-mint" />
            Cart
          </div>
          <button aria-label="Close cart" className="rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/10" onClick={closeCart}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="rounded-md border border-dashed border-black/15 p-8 text-center dark:border-white/15">
              <ShoppingBag className="mx-auto h-10 w-10 text-forge-steel" />
              <p className="mt-3 text-sm text-forge-steel">Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((line) => (
                <div key={line.product.id} className="grid grid-cols-[72px_1fr] gap-3 rounded-md border border-black/10 p-3 dark:border-white/10">
                  <div className="relative h-20 overflow-hidden rounded-md bg-forge-panel dark:bg-white/10">
                    <Image src={line.product.image_url || "/assets/hero-3d-printing.png"} alt={line.product.name} fill className="object-cover" sizes="72px" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{line.product.name}</p>
                        <p className="text-xs text-forge-steel">{formatCurrency(line.product.price)}</p>
                      </div>
                      <button aria-label="Remove item" className="rounded-md p-1.5 text-forge-steel hover:bg-black/5 hover:text-forge-coral dark:hover:bg-white/10" onClick={() => removeItem(line.product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex h-9 items-center rounded-md border border-black/10 dark:border-white/10">
                        <button aria-label="Decrease quantity" className="px-2" onClick={() => updateQuantity(line.product.id, line.quantity - 1)}>
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">{line.quantity}</span>
                        <button aria-label="Increase quantity" className="px-2" onClick={() => updateQuantity(line.product.id, line.quantity + 1)}>
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(line.product.price * line.quantity)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-black/10 p-5 dark:border-white/10">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-forge-steel">Subtotal</span>
            <span className="text-lg font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/cart" className="btn-secondary" onClick={closeCart}>
              View Cart
            </Link>
            <Link href="/checkout" className="btn-primary" onClick={closeCart}>
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

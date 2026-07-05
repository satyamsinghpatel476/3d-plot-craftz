"use client";

import { FormEvent, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { formatCurrency, slugify } from "@/lib/utils";

export function AdminProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const payload = {
      name,
      slug: String(form.get("slug") || slugify(name)),
      description: String(form.get("description") ?? ""),
      category: String(form.get("category") ?? ""),
      product_type: String(form.get("product_type") ?? ""),
      price: Number(form.get("price") ?? 0),
      stock: Number(form.get("stock") ?? 0),
      image_url: String(form.get("image_url") || "/assets/hero-3d-printing.png"),
      material: String(form.get("material") ?? "PLA"),
      color: String(form.get("color") ?? "White"),
      dimensions: String(form.get("dimensions") ?? ""),
      is_active: form.get("is_active") === "on"
    };

    const response = await fetch(editing ? `/api/products/${editing.id}` : "/api/products", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(result.error ?? "Product save failed");
      return;
    }

    const saved = result.product as Product;
    setProducts((current) => (editing ? current.map((product) => (product.id === saved.id ? saved : product)) : [saved, ...current]));
    setEditing(null);
    event.currentTarget.reset();
    toast.success(editing ? "Product updated" : "Product added");
  }

  async function deleteProduct(productId: string) {
    const response = await fetch(`/api/products/${productId}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Delete failed");
      return;
    }

    setProducts((current) => current.filter((product) => product.id !== productId));
    toast.success("Product deleted");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form key={editing?.id ?? "new-product"} onSubmit={handleSubmit} className="rounded-md border border-black/10 p-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          {editing ? <Pencil className="h-5 w-5 text-forge-mint" /> : <Plus className="h-5 w-5 text-forge-mint" />}
          <h3 className="font-bold">{editing ? "Edit product" : "Add product"}</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="name" required className="field" placeholder="Name" defaultValue={editing?.name} />
          <input name="slug" className="field" placeholder="Slug" defaultValue={editing?.slug} />
          <input name="category" required className="field" placeholder="Category" defaultValue={editing?.category} />
          <input name="product_type" required className="field" placeholder="Product type" defaultValue={editing?.product_type} />
          <input name="price" required type="number" min="0" className="field" placeholder="Price" defaultValue={editing?.price} />
          <input name="stock" required type="number" min="0" className="field" placeholder="Stock" defaultValue={editing?.stock} />
          <input name="material" required className="field" placeholder="Material" defaultValue={editing?.material} />
          <input name="color" required className="field" placeholder="Color" defaultValue={editing?.color} />
          <input name="dimensions" className="field sm:col-span-2" placeholder="Dimensions" defaultValue={editing?.dimensions ?? ""} />
          <input name="image_url" className="field sm:col-span-2" placeholder="Image URL" defaultValue={editing?.image_url ?? "/assets/hero-3d-printing.png"} />
          <textarea name="description" required rows={4} className="field sm:col-span-2" placeholder="Description" defaultValue={editing?.description} />
          <label className="flex items-center gap-2 text-sm text-forge-steel">
            <input name="is_active" type="checkbox" defaultChecked={editing?.is_active ?? true} className="accent-forge-mint" />
            Active
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <button disabled={loading} className="btn-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Save
          </button>
          {editing && (
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="grid gap-3">
        {products.map((product) => (
          <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-black/10 p-3 dark:border-white/10">
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-forge-steel">{product.category} · {formatCurrency(product.price)} · stock {product.stock}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md border border-black/10 hover:border-forge-mint hover:text-forge-mint dark:border-white/10" onClick={() => setEditing(product)} aria-label={`Edit ${product.name}`}>
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md border border-black/10 text-forge-coral hover:border-forge-coral dark:border-white/10" onClick={() => deleteProduct(product.id)} aria-label={`Delete ${product.name}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

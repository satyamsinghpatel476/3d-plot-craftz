"use client";

import { FormEvent, useState } from "react";
import { ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { slugify } from "@/lib/utils";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
};

export function AdminCategoryManager({ initialCategories }: { initialCategories: CategoryRow[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [editing, setEditing] = useState<CategoryRow | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const payload = {
      name,
      slug: String(form.get("slug") || slugify(name)),
      description: String(form.get("description") ?? ""),
      image_url: String(form.get("image_url") || "/assets/hero-3d-printing.png")
    };

    const response = await fetch(editing ? `/api/categories/${editing.id}` : "/api/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Category save failed");
      return;
    }

    const saved = result.category as CategoryRow;
    setCategories((current) => (editing ? current.map((category) => (category.id === saved.id ? saved : category)) : [saved, ...current]));
    setEditing(null);
    event.currentTarget.reset();
    toast.success(editing ? "Category updated" : "Category added");
  }

  async function deleteCategory(id: string) {
    const response = await fetch(`/api/categories/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Category delete failed");
      return;
    }

    setCategories((current) => current.filter((category) => category.id !== id));
    toast.success("Category deleted");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <form key={editing?.id ?? "new-category"} onSubmit={handleSubmit} className="rounded-md border border-black/10 p-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-forge-mint" />
          <h3 className="font-bold">{editing ? "Edit category" : "Add category"}</h3>
        </div>
        <div className="mt-4 grid gap-3">
          <input name="name" required className="field" placeholder="Name" defaultValue={editing?.name} />
          <input name="slug" className="field" placeholder="Slug" defaultValue={editing?.slug} />
          <input name="image_url" className="field" placeholder="Image URL" defaultValue={editing?.image_url ?? "/assets/hero-3d-printing.png"} />
          <textarea name="description" rows={3} className="field" placeholder="Description" defaultValue={editing?.description ?? ""} />
        </div>
        <div className="mt-4 flex gap-3">
          <button className="btn-primary">
            <Plus className="h-4 w-4" />
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
        {categories.map((category) => (
          <div key={category.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-black/10 p-3 dark:border-white/10">
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-sm text-forge-steel">{category.slug}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md border border-black/10 hover:border-forge-mint hover:text-forge-mint dark:border-white/10" onClick={() => setEditing(category)} aria-label={`Edit ${category.name}`}>
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md border border-black/10 text-forge-coral hover:border-forge-coral dark:border-white/10" onClick={() => deleteCategory(category.id)} aria-label={`Delete ${category.name}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

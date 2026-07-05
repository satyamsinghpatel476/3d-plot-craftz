"use client";

import { FormEvent, useState } from "react";
import { GalleryHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

type GalleryRow = {
  id: string;
  title: string;
  image_url: string;
  material: string;
  print_time: string;
  purpose: string;
  description: string;
  category?: string | null;
};

export function AdminGalleryManager({ initialItems }: { initialItems: GalleryRow[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<GalleryRow | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      title: String(form.get("title") ?? ""),
      image_url: String(form.get("image_url") || "/assets/hero-3d-printing.png"),
      material: String(form.get("material") ?? ""),
      print_time: String(form.get("print_time") ?? ""),
      purpose: String(form.get("purpose") ?? ""),
      description: String(form.get("description") ?? ""),
      category: String(form.get("category") ?? "")
    };

    const response = await fetch(editing ? `/api/gallery/${editing.id}` : "/api/gallery", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Gallery save failed");
      return;
    }

    const saved = result.galleryItem as GalleryRow;
    setItems((current) => (editing ? current.map((item) => (item.id === saved.id ? saved : item)) : [saved, ...current]));
    setEditing(null);
    event.currentTarget.reset();
    toast.success(editing ? "Gallery item updated" : "Gallery item added");
  }

  async function deleteItem(id: string) {
    const response = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (!response.ok) {
      toast.error(result.error ?? "Gallery delete failed");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Gallery item deleted");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <form key={editing?.id ?? "new-gallery-item"} onSubmit={handleSubmit} className="rounded-md border border-black/10 p-4 dark:border-white/10">
        <div className="flex items-center gap-2">
          <GalleryHorizontal className="h-5 w-5 text-forge-mint" />
          <h3 className="font-bold">{editing ? "Edit gallery item" : "Add gallery item"}</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input name="title" required className="field" placeholder="Title" defaultValue={editing?.title} />
          <input name="material" required className="field" placeholder="Material" defaultValue={editing?.material} />
          <input name="print_time" required className="field" placeholder="Print time" defaultValue={editing?.print_time} />
          <input name="purpose" required className="field" placeholder="Purpose" defaultValue={editing?.purpose} />
          <input name="category" className="field sm:col-span-2" placeholder="Category" defaultValue={editing?.category ?? ""} />
          <input name="image_url" className="field sm:col-span-2" placeholder="Image URL" defaultValue={editing?.image_url ?? "/assets/hero-3d-printing.png"} />
          <textarea name="description" required rows={4} className="field sm:col-span-2" placeholder="Description" defaultValue={editing?.description ?? ""} />
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
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-black/10 p-3 dark:border-white/10">
            <div>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-forge-steel">{item.material} · {item.print_time}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md border border-black/10 hover:border-forge-mint hover:text-forge-mint dark:border-white/10" onClick={() => setEditing(item)} aria-label={`Edit ${item.title}`}>
                <Pencil className="h-4 w-4" />
              </button>
              <button type="button" className="grid h-9 w-9 place-items-center rounded-md border border-black/10 text-forge-coral hover:border-forge-coral dark:border-white/10" onClick={() => deleteItem(item.id)} aria-label={`Delete ${item.title}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

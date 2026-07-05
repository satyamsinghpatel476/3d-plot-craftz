import Image from "next/image";

type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  material: string;
  print_time: string;
  purpose: string;
  description: string;
  category?: string;
};

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="overflow-hidden rounded-md border border-black/10 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lift dark:border-white/10 dark:bg-white/[0.06]">
          <div className="relative aspect-[4/3] bg-forge-panel dark:bg-white/10">
            <Image src={item.image_url || "/assets/hero-3d-printing.png"} alt={item.title} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 100vw" />
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-md bg-forge-mint/12 px-2 py-1 text-forge-mint">{item.material}</span>
              <span className="rounded-md bg-forge-blue/10 px-2 py-1 text-forge-blue">{item.print_time}</span>
            </div>
            <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
            <p className="mt-1 text-sm font-medium text-forge-steel">{item.purpose}</p>
            <p className="mt-3 text-sm leading-6 text-forge-steel">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

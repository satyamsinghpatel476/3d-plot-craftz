import { GalleryGrid } from "@/components/GalleryGrid";
import { getGalleryItems } from "@/lib/data";

export const metadata = {
  title: "Work Gallery"
};

export default async function GalleryPage() {
  const items = await getGalleryItems();

  return (
    <section className="container-px section-y">
      <div className="max-w-3xl">
        <p className="eyebrow">Work Gallery</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Printed work across robotics, education, engineering, and decor.</h1>
      </div>
      <div className="mt-10">
        <GalleryGrid items={items} />
      </div>
    </section>
  );
}

import { UploadWorkbench } from "@/components/UploadWorkbench";

export const metadata = {
  title: "Upload STL"
};

export default function UploadPage() {
  return (
    <section className="container-px section-y">
      <div className="mb-10 max-w-3xl">
        <p className="eyebrow">STL Upload</p>
        <h1 className="mt-3 text-4xl font-black sm:text-5xl">Preview, configure, price, and submit your model.</h1>
        <p className="mt-4 text-forge-steel">Files are validated, stored in Supabase Storage, and saved with material, color, infill, hollow/solid, AI suggestions, and estimated quote metadata.</p>
      </div>
      <UploadWorkbench />
    </section>
  );
}

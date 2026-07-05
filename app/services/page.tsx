import Link from "next/link";
import { BrainCircuit, Cog, Printer, UploadCloud } from "lucide-react";

export const metadata = {
  title: "Services"
};

const services = [
  { icon: UploadCloud, title: "STL upload and quote", description: "Upload model files, select print settings, preview the model, and save a quote." },
  { icon: BrainCircuit, title: "AI recommendation", description: "Get material, infill, support, quality, cost, risk, and STL improvement suggestions." },
  { icon: Printer, title: "Production printing", description: "PLA, PETG, ABS, TPU, and resin workflows for different strength and finish needs." },
  { icon: Cog, title: "Part sourcing", description: "Shop printers, filament, robotics parts, educational models, decorative items, and replacement parts." }
];

export default function ServicesPage() {
  return (
    <section className="container-px section-y">
      <p className="eyebrow">Services</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-5xl">3D printing services for prototypes, custom parts, and finished products.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {services.map(({ icon: Icon, title, description }) => (
          <article key={title} className="surface rounded-md p-6">
            <Icon className="h-7 w-7 text-forge-mint" />
            <h2 className="mt-5 text-xl font-bold">{title}</h2>
            <p className="mt-3 text-forge-steel">{description}</p>
          </article>
        ))}
      </div>
      <Link href="/upload" className="btn-primary mt-10">Start a print</Link>
    </section>
  );
}

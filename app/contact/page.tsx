import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Contact Us"
};

export default function ContactPage() {
  return (
    <section className="container-px section-y">
      <p className="eyebrow">Contact Us</p>
      <h1 className="mt-3 max-w-4xl text-4xl font-black sm:text-5xl">Talk to PartForge 3D about your print, product, or order.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <a href={`mailto:${siteConfig.email}`} className="surface rounded-md p-6 hover:border-forge-mint">
          <Mail className="h-7 w-7 text-forge-mint" />
          <h2 className="mt-4 font-bold">Email</h2>
          <p className="mt-2 text-forge-steel">{siteConfig.email}</p>
        </a>
        <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="surface rounded-md p-6 hover:border-forge-mint">
          <Phone className="h-7 w-7 text-forge-mint" />
          <h2 className="mt-4 font-bold">Phone</h2>
          <p className="mt-2 text-forge-steel">{siteConfig.phone}</p>
        </a>
        <Link href="/help-desk" className="surface rounded-md p-6 hover:border-forge-mint">
          <h2 className="font-bold">Help Desk</h2>
          <p className="mt-2 text-forge-steel">Create tickets for order issues, file upload help, and support requests.</p>
        </Link>
      </div>
    </section>
  );
}

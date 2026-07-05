import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/siteConfig";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-forge-ink text-white dark:border-white/10">
      <div className="container-px grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3 text-lg font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-white text-forge-ink">PF</span>
            {siteConfig.brand}
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/70">{siteConfig.tagline} Upload STL files, order finished parts, and source 3D printing products from one production-ready platform.</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <div className="mt-4 grid gap-2 text-sm text-white/70">
            {navLinks.slice(0, 6).map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-forge-mint">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Contact</h2>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-forge-mint">
              <Mail className="h-4 w-4" />
              {siteConfig.email}
            </a>
            <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-forge-mint">
              <Phone className="h-4 w-4" />
              {siteConfig.phone}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {siteConfig.address}
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        © {new Date().getFullYear()} {siteConfig.brand}. Built for Vercel, Supabase, and Razorpay.
      </div>
    </footer>
  );
}

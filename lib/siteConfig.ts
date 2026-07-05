import type { Material, PrintColor } from "@/lib/types";

export const siteConfig = {
  brand: "PartForge 3D",
  tagline: "Production-grade 3D printing, parts, and prototyping.",
  email: "hello@partforge3d.com",
  phone: "+91 90000 00000",
  whatsapp: "https://wa.me/919000000000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  address: "Bengaluru, Karnataka, India",
  heroImage: "/assets/hero-3d-printing.png"
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Upload STL", href: "/upload" },
  { label: "AI Recommendation", href: "/ai-recommendation" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/categories" },
  { label: "Work Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Help Desk", href: "/help-desk" }
];

export const materials: Array<{
  id: Material;
  label: string;
  summary: string;
  ratePerGram: number;
  bestFor: string;
}> = [
  { id: "PLA", label: "PLA", summary: "Clean surface finish and low-cost everyday prints.", ratePerGram: 4, bestFor: "decorative, educational, concept parts" },
  { id: "PETG", label: "PETG", summary: "Durable, slightly flexible, and moisture resistant.", ratePerGram: 5.5, bestFor: "functional parts, brackets, robotics" },
  { id: "ABS", label: "ABS", summary: "Tough and heat-resistant for demanding environments.", ratePerGram: 6, bestFor: "enclosures, heat exposure, fixtures" },
  { id: "TPU", label: "TPU", summary: "Flexible material for grips, seals, and soft parts.", ratePerGram: 7.5, bestFor: "flexible parts, bumpers, gaskets" },
  { id: "Resin", label: "Resin", summary: "High-detail prints for miniatures and presentation parts.", ratePerGram: 8.5, bestFor: "miniatures, dental-style models, detailed prototypes" }
];

export const printColors: Array<{ id: PrintColor; label: string; value: string }> = [
  { id: "White", label: "White", value: "#f8fafc" },
  { id: "Black", label: "Black", value: "#111827" },
  { id: "Red", label: "Red", value: "#ef4444" },
  { id: "Blue", label: "Blue", value: "#2563eb" },
  { id: "Green", label: "Green", value: "#16a34a" },
  { id: "Yellow", label: "Yellow", value: "#facc15" },
  { id: "Grey", label: "Grey", value: "#9ca3af" },
  { id: "Orange", label: "Orange", value: "#f97316" },
  { id: "Transparent", label: "Transparent", value: "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)" },
  { id: "Custom color", label: "Custom", value: "conic-gradient(from 180deg, #ef4444, #facc15, #16a34a, #2563eb, #ef4444)" }
];

export const categories = [
  "Filament",
  "3D Printed Objects",
  "STL Files",
  "3D Printers",
  "Custom Parts",
  "Engineering Parts",
  "Decorative Items",
  "Robotics Parts",
  "Educational Models",
  "Replacement Parts"
];

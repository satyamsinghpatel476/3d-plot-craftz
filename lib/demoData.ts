import type { Product } from "@/lib/types";

export const sampleProducts: Product[] = [
  {
    id: "1b27ad27-9941-4ccf-a764-cbdf51f0f8a1",
    name: "ForgeBot Mini 3D Printer",
    slug: "forgebot-mini-3d-printer",
    description: "A compact enclosed FDM printer for schools, workshops, and prototyping labs. Ships with starter PLA and tuned slicer profiles.",
    short_description: "Compact FDM printer for reliable daily prototyping.",
    category: "3D Printers",
    product_type: "3D Printer",
    price: 24999,
    stock: 8,
    image_url: "/assets/hero-3d-printing.png",
    material: "PLA",
    color: "Black",
    dimensions: "380 x 360 x 420 mm",
    rating: 4.7,
    is_active: true
  },
  {
    id: "d58085d6-891c-4e21-8dfd-4069e81f52f1",
    name: "Matte PLA Filament 1kg",
    slug: "matte-pla-filament-1kg",
    description: "Low-warp matte PLA filament with clean layer adhesion and consistent diameter for everyday prints.",
    short_description: "Reliable 1kg PLA spool for clean surface finishes.",
    category: "Filament",
    product_type: "Filament",
    price: 1199,
    stock: 34,
    image_url: "/assets/hero-3d-printing.png",
    material: "PLA",
    color: "White",
    dimensions: "1.75 mm diameter, 1 kg spool",
    rating: 4.8,
    is_active: true
  },
  {
    id: "be44b13b-7606-4595-9321-06ef7e368f89",
    name: "Robotics Servo Bracket Set",
    slug: "robotics-servo-bracket-set",
    description: "PETG printed bracket kit for educational robotics arms, grippers, and chassis assemblies.",
    short_description: "PETG bracket kit for robotics builds.",
    category: "Robotics Parts",
    product_type: "Ready-made 3D Printed Objects",
    price: 699,
    stock: 20,
    image_url: "/assets/hero-3d-printing.png",
    material: "PETG",
    color: "Black",
    dimensions: "Assorted brackets, M3 hardware ready",
    rating: 4.6,
    is_active: true
  },
  {
    id: "c217651f-392e-4eed-a8b8-5cd26ca2bff7",
    name: "Decorative Voronoi Planter",
    slug: "decorative-voronoi-planter",
    description: "Lightweight PLA planter printed with a sculptural Voronoi shell and optional waterproof insert.",
    short_description: "Decorative PLA object for desks and interiors.",
    category: "Decorative Items",
    product_type: "3D Printed Object",
    price: 549,
    stock: 15,
    image_url: "/assets/hero-3d-printing.png",
    material: "PLA",
    color: "Green",
    dimensions: "120 x 120 x 100 mm",
    rating: 4.5,
    is_active: true
  }
];

export const sampleGallery = [
  {
    id: "g1",
    title: "Drone Arm Prototype",
    image_url: "/assets/hero-3d-printing.png",
    material: "PETG",
    print_time: "6h 20m",
    purpose: "Robotics prototype",
    description: "Lightweight arm iteration printed with 55% infill for crash testing.",
    category: "Robotics Parts"
  },
  {
    id: "g2",
    title: "Architectural Massing Model",
    image_url: "/assets/hero-3d-printing.png",
    material: "PLA",
    print_time: "11h",
    purpose: "Presentation model",
    description: "Multi-part city block concept with clean white matte finishing.",
    category: "Educational Models"
  },
  {
    id: "g3",
    title: "Replacement Machine Knob",
    image_url: "/assets/hero-3d-printing.png",
    material: "ABS",
    print_time: "2h 45m",
    purpose: "Functional replacement",
    description: "Heat-resistant replacement part with reinforced internal ribs.",
    category: "Replacement Parts"
  }
];

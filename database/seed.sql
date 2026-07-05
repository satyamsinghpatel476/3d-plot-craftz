insert into public.categories (id, name, slug, description, image_url)
values
  ('53b0f2d3-d34b-40a8-846d-5afd7bce0ec1', 'Filament', 'filament', 'PLA, PETG, ABS, TPU, and specialty spools.', '/assets/hero-3d-printing.png'),
  ('ac39e2e9-0fb8-48f1-ae4f-d715ceee7647', '3D Printed Objects', '3d-printed-objects', 'Ready-made printed objects for home, school, and work.', '/assets/hero-3d-printing.png'),
  ('f21e856e-d0fe-498e-a363-62668675957a', 'STL Files', 'stl-files', 'Printable digital models and objects.', '/assets/hero-3d-printing.png'),
  ('15c0b06b-5d3c-4ba3-a11b-df576db43a8a', '3D Printers', '3d-printers', 'Printers, parts, and accessories.', '/assets/hero-3d-printing.png'),
  ('ac5054ed-2b57-4cf9-b1c0-bfcf90766531', 'Custom Parts', 'custom-parts', 'Custom manufactured parts from uploaded STL files.', '/assets/hero-3d-printing.png'),
  ('46a5e5fd-1d1c-4d53-88b4-7487a478405c', 'Engineering Parts', 'engineering-parts', 'Functional mechanical components.', '/assets/hero-3d-printing.png'),
  ('e53acb44-5971-4c10-bfa6-69ad64857e15', 'Decorative Items', 'decorative-items', 'Planters, lamps, decor, and display pieces.', '/assets/hero-3d-printing.png'),
  ('9b2f380e-06c4-473e-ad9d-5f5b7e79b50f', 'Robotics Parts', 'robotics-parts', 'Servo brackets, chassis parts, mounts, and frames.', '/assets/hero-3d-printing.png'),
  ('d854c814-3c59-47b5-ad66-6d67b3076863', 'Educational Models', 'educational-models', 'Learning aids for schools, workshops, and training.', '/assets/hero-3d-printing.png'),
  ('85ce2c1c-460b-4a47-a358-329facdb8779', 'Replacement Parts', 'replacement-parts', 'Knobs, clips, adapters, and repair parts.', '/assets/hero-3d-printing.png')
on conflict (slug) do update
set name = excluded.name,
    description = excluded.description,
    image_url = excluded.image_url;

insert into public.products (id, name, slug, description, short_description, category, product_type, price, stock, image_url, material, color, dimensions, rating, is_active)
values
  ('1b27ad27-9941-4ccf-a764-cbdf51f0f8a1', 'ForgeBot Mini 3D Printer', 'forgebot-mini-3d-printer', 'A compact enclosed FDM printer for schools, workshops, and prototyping labs. Ships with starter PLA and tuned slicer profiles.', 'Compact FDM printer for reliable daily prototyping.', '3D Printers', '3D Printer', 24999, 8, '/assets/hero-3d-printing.png', 'PLA', 'Black', '380 x 360 x 420 mm', 4.7, true),
  ('d58085d6-891c-4e21-8dfd-4069e81f52f1', 'Matte PLA Filament 1kg', 'matte-pla-filament-1kg', 'Low-warp matte PLA filament with clean layer adhesion and consistent diameter for everyday prints.', 'Reliable 1kg PLA spool for clean surface finishes.', 'Filament', 'Filament', 1199, 34, '/assets/hero-3d-printing.png', 'PLA', 'White', '1.75 mm diameter, 1 kg spool', 4.8, true),
  ('be44b13b-7606-4595-9321-06ef7e368f89', 'Robotics Servo Bracket Set', 'robotics-servo-bracket-set', 'PETG printed bracket kit for educational robotics arms, grippers, and chassis assemblies.', 'PETG bracket kit for robotics builds.', 'Robotics Parts', 'Ready-made 3D Printed Objects', 699, 20, '/assets/hero-3d-printing.png', 'PETG', 'Black', 'Assorted brackets, M3 hardware ready', 4.6, true),
  ('c217651f-392e-4eed-a8b8-5cd26ca2bff7', 'Decorative Voronoi Planter', 'decorative-voronoi-planter', 'Lightweight PLA planter printed with a sculptural Voronoi shell and optional waterproof insert.', 'Decorative PLA object for desks and interiors.', 'Decorative Items', '3D Printed Object', 549, 15, '/assets/hero-3d-printing.png', 'PLA', 'Green', '120 x 120 x 100 mm', 4.5, true),
  ('8d09a2fb-5167-4268-bbbd-44e8714e1d9b', 'TPU Cable Grommet Pack', 'tpu-cable-grommet-pack', 'Flexible TPU cable grommets for desks, control boxes, and electronics enclosures.', 'Flexible TPU grommets for wire routing.', 'Engineering Parts', 'Replacement Parts', 349, 45, '/assets/hero-3d-printing.png', 'TPU', 'Black', 'Assorted 20-40 mm sizes', 4.4, true),
  ('b2c06a1e-1e57-49a6-83a1-d204ec5b728d', 'STEM Gear Train Model', 'stem-gear-train-model', 'Educational gear train model for classroom demonstrations and mechanical learning.', 'Educational model for mechanical concepts.', 'Educational Models', 'Educational Model', 899, 12, '/assets/hero-3d-printing.png', 'PLA', 'Yellow', '220 x 140 x 65 mm', 4.7, true)
on conflict (id) do update
set name = excluded.name,
    slug = excluded.slug,
    description = excluded.description,
    short_description = excluded.short_description,
    category = excluded.category,
    product_type = excluded.product_type,
    price = excluded.price,
    stock = excluded.stock,
    image_url = excluded.image_url,
    material = excluded.material,
    color = excluded.color,
    dimensions = excluded.dimensions,
    rating = excluded.rating,
    is_active = excluded.is_active;

insert into public.gallery_items (title, image_url, material, print_time, purpose, description, category)
values
  ('Drone Arm Prototype', '/assets/hero-3d-printing.png', 'PETG', '6h 20m', 'Robotics prototype', 'Lightweight arm iteration printed with 55% infill for crash testing.', 'Robotics Parts'),
  ('Architectural Massing Model', '/assets/hero-3d-printing.png', 'PLA', '11h', 'Presentation model', 'Multi-part city block concept with clean white matte finishing.', 'Educational Models'),
  ('Replacement Machine Knob', '/assets/hero-3d-printing.png', 'ABS', '2h 45m', 'Functional replacement', 'Heat-resistant replacement part with reinforced internal ribs.', 'Replacement Parts')
on conflict do nothing;

-- Admin setup:
-- 1. Sign up once through the website.
-- 2. In Supabase SQL editor, replace the email below and run:
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';

# PartForge 3D

Repository: `3d-plot-craftz`.

PartForge 3D is a full-stack 3D printing service and e-commerce website built with Next.js App Router, Supabase, Razorpay, Tailwind CSS, and a provider-ready AI recommendation layer.

It supports STL upload, 3D preview, print quoting, product shopping, cart, checkout, authentication, orders, reviews, support tickets, admin management, and database/security files for production deployment.

## Features

- Premium responsive landing page for a 3D printing business
- Supabase Auth signup, login, logout, forgot password, profiles, and admin role support
- Protected dashboard, admin, and upload routes
- STL file upload to Supabase Storage with file validation and metadata persistence
- Three.js STL/model viewer through `@react-three/fiber`
- Rule-based AI recommendation API with optional Gemini/OpenAI provider switches
- Editable quote calculator in `lib/priceCalculator.ts`
- Product shop, dynamic product pages, reviews, cart, checkout, and orders
- Razorpay server-side order creation and signature verification
- Help desk tickets, work gallery, categories, and admin analytics
- Dark/light mode, mobile navigation, cart drawer, toast notifications, and loading skeletons
- SQL schema, RLS policies, seed data, and storage bucket setup

## Tech Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide icons
- 3D: Three.js, `@react-three/fiber`, `@react-three/drei`
- Backend: Next.js route handlers, Zod validation, server-only Supabase/Razorpay helpers
- Database/Auth/Storage: Supabase Auth, PostgreSQL, Storage, RLS
- Payments: Razorpay test/live keys through environment variables
- Deployment: Vercel

## Folder Structure

```text
partforge-3d/
├── app/
│   ├── api/
│   ├── admin/
│   ├── ai-recommendation/
│   ├── cart/
│   ├── checkout/
│   ├── dashboard/
│   ├── gallery/
│   ├── login/
│   ├── product/[id]/
│   ├── shop/
│   └── upload/
├── components/
├── database/
├── lib/
├── public/assets/
├── .env.example
├── package.json
└── tailwind.config.ts
```

## Install

Use Node.js 20 LTS or newer.

```bash
cd partforge-3d
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a new Supabase project.
2. Go to Project Settings > API.
3. Copy:
   - Project URL to `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service role key to `SUPABASE_SERVICE_ROLE_KEY`
4. Open SQL Editor and run these files in order:

```text
database/schema.sql
database/rls-policies.sql
database/seed.sql
```

The schema creates the storage buckets:

- `stl-files`
- `product-images`
- `gallery-images`
- `user-uploads`

If a bucket already exists, Supabase will update the settings defined in `schema.sql`.

## Admin User

1. Sign up through `/signup`.
2. Open Supabase SQL Editor.
3. Run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

Then visit `/admin`.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

AI_PROVIDER=
GEMINI_API_KEY=
OPENAI_API_KEY=

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Keep `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `GEMINI_API_KEY`, and `OPENAI_API_KEY` server-only. Do not prefix them with `NEXT_PUBLIC_`.

## Razorpay Test Mode

1. Create or open a Razorpay account.
2. Switch to Test Mode.
3. Go to Account & Settings > API Keys.
4. Generate test keys.
5. Set:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
6. Start the dev server and place an order with Razorpay checkout.

The frontend only receives the public key. Order creation and signature verification happen in:

```text
app/api/payments/create-order/route.ts
app/api/payments/verify/route.ts
```

## AI Recommendations

The current system uses rule-based logic in `lib/aiRecommendation.ts`.

Optional provider switches:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=
```

or:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=
```

Provider calls are intentionally isolated so the UI and API contract remain stable when a hosted AI model is connected.

## Development Commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run start
```

## Vercel Deployment

1. Push this `partforge-3d` project to GitHub.
2. Create a new Vercel project from the GitHub repo.
3. Set the framework preset to Next.js.
4. Add all environment variables from `.env.example`.
5. Set `NEXT_PUBLIC_SITE_URL` to the Vercel production URL.
6. Deploy.

Do not use GitHub Pages for this final website. It needs server routes, environment variables, Supabase Auth cookies, file upload, and Razorpay verification.

## Push To GitHub

```bash
cd partforge-3d
git init
git add .
git commit -m "Build PartForge 3D full-stack website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/partforge-3d.git
git push -u origin main
```

If this project lives inside a larger repo, run the Git commands from the repo root instead and commit the `partforge-3d/` folder.

## LinkedIn Sharing

Suggested post:

```text
I built PartForge 3D, a full-stack 3D printing service and e-commerce platform.

Stack: Next.js App Router, TypeScript, Tailwind, Supabase Auth/Postgres/Storage, Razorpay, Three.js STL preview, and an AI-ready recommendation API.

Features include STL upload, print quoting, shop/cart/checkout, admin dashboard, reviews, help desk, work gallery, and production deployment docs.
```

Add a screenshot of the home page, STL upload page, and admin dashboard.

## Future Improvements

- Connect the Gemini/OpenAI adapter to a live model
- Add slicer-based STL volume and support analysis
- Add email notifications for orders and support tickets
- Add coupon codes, invoices, and shipping integrations
- Add admin CRUD screens for categories and gallery uploads
- Add Playwright end-to-end tests for checkout and auth flows
- Add generated OpenGraph images for product sharing

"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, UploadCloud } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-forge-ink text-white">
      <Image src={siteConfig.heroImage} alt="3D printer producing a precision part" fill priority className="object-cover opacity-50" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-forge-ink via-forge-ink/82 to-forge-ink/25" />
      <div className="container-px relative flex min-h-[calc(100vh-4rem)] items-center pb-24 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <p className="eyebrow">Upload, quote, print, deliver</p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">{siteConfig.brand}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
            A production-ready 3D printing service with STL upload, AI print recommendations, instant pricing, e-commerce checkout, and admin operations in one stack.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/upload" className="btn-primary bg-forge-mint text-forge-ink hover:bg-white">
              <UploadCloud className="h-5 w-5" />
              Upload STL
            </Link>
            <Link href="/ai-recommendation" className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white hover:text-forge-ink">
              <BrainCircuit className="h-5 w-5" />
              AI Recommendation
            </Link>
          </div>
          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 text-sm text-white/75">
            <div>
              <p className="text-2xl font-bold text-white">5+</p>
              <p>Materials</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Razorpay</p>
              <p>Test-ready payments</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Supabase</p>
              <p>Auth, DB, storage</p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white/90 py-4 text-forge-ink backdrop-blur dark:bg-forge-ink/90 dark:text-white">
        <div className="container-px flex flex-wrap items-center justify-between gap-3 text-sm">
          <span>Instant quote logic for hollow, solid, infill, urgency, color, and finishing.</span>
          <Link href="/shop" className="inline-flex items-center gap-2 font-semibold text-forge-mint">
            Browse shop <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

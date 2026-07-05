import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.brand} | 3D Printing Service and Shop`,
    template: `%s | ${siteConfig.brand}`
  },
  description: "Upload STL files, get AI-guided 3D printing recommendations, shop 3D printing products, and pay securely with Razorpay.",
  openGraph: {
    title: siteConfig.brand,
    description: siteConfig.tagline,
    images: [siteConfig.heroImage]
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

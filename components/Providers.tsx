"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/CartProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <CartProvider>{children}</CartProvider>
      <Toaster richColors closeButton position="top-right" />
    </ThemeProvider>
  );
}

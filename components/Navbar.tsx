"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingCart, UserCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/CartDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/components/CartProvider";
import { createBrowserSupabaseClient, isSupabaseBrowserConfigured } from "@/lib/supabaseClient";
import { navLinks, siteConfig } from "@/lib/siteConfig";
import { cn } from "@/lib/utils";

type Profile = {
  full_name: string | null;
  email: string | null;
  role: string | null;
};

export function Navbar() {
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!isSupabaseBrowserConfigured) return;

    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profileData } = await supabase.from("profiles").select("full_name,email,role").eq("id", data.user.id).single();
      setProfile(profileData as Profile | null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setProfile(null);
        return;
      }
      const { data: profileData } = await supabase.from("profiles").select("full_name,email,role").eq("id", session.user.id).single();
      setProfile(profileData as Profile | null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const dashboardHref = profile?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/10 bg-white/82 backdrop-blur-xl dark:border-white/10 dark:bg-forge-ink/82">
        <div className="container-px flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-forge-ink text-white dark:bg-white dark:text-forge-ink">PF</span>
            <span className="whitespace-nowrap">{siteConfig.brand}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(0, 8).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium text-forge-steel transition hover:bg-black/5 hover:text-forge-ink dark:hover:bg-white/10 dark:hover:text-white",
                  pathname === link.href && "bg-black/5 text-forge-ink dark:bg-white/10 dark:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              aria-label="Open cart"
              title="Cart"
              onClick={openCart}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white transition hover:border-forge-mint hover:text-forge-mint dark:border-white/15 dark:bg-white/5"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-forge-coral px-1 text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </button>
            <Link href={profile ? dashboardHref : "/login"} className="hidden items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm font-semibold transition hover:border-forge-mint hover:text-forge-mint dark:border-white/15 sm:inline-flex">
              <UserCircle className="h-4 w-4" />
              {profile?.full_name?.split(" ")[0] ?? (profile ? "Dashboard" : "Login")}
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white dark:border-white/15 dark:bg-white/5 lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-black/10 bg-white p-4 shadow-soft dark:border-white/10 dark:bg-forge-ink lg:hidden">
            <nav className="grid gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium text-forge-steel hover:bg-black/5 hover:text-forge-ink dark:hover:bg-white/10 dark:hover:text-white",
                    pathname === link.href && "bg-black/5 text-forge-ink dark:bg-white/10 dark:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={profile ? dashboardHref : "/login"} onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-forge-mint">
                {profile ? "Dashboard" : "Login / Signup"}
              </Link>
            </nav>
          </div>
        )}
      </header>
      <CartDrawer />
    </>
  );
}

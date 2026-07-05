import Link from "next/link";
import { BarChart3, Boxes, CreditCard, GalleryHorizontal, HelpCircle, Layers3, MessageSquare, Package, UploadCloud, Users } from "lucide-react";

const adminLinks = [
  { label: "Analytics", href: "/admin", icon: BarChart3 },
  { label: "Users", href: "/admin#users", icon: Users },
  { label: "Products", href: "/admin#products", icon: Boxes },
  { label: "Categories", href: "/admin#categories", icon: Layers3 },
  { label: "Orders", href: "/admin#orders", icon: Package },
  { label: "Uploads", href: "/admin#uploads", icon: UploadCloud },
  { label: "Payments", href: "/admin#payments", icon: CreditCard },
  { label: "Gallery", href: "/admin#gallery", icon: GalleryHorizontal },
  { label: "Reviews", href: "/admin#reviews", icon: MessageSquare },
  { label: "Help Desk", href: "/admin#tickets", icon: HelpCircle }
];

export function AdminSidebar() {
  return (
    <aside className="rounded-md border border-black/10 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-white/[0.06]">
      <nav className="grid gap-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-forge-steel hover:bg-black/5 hover:text-forge-mint dark:hover:bg-white/10">
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

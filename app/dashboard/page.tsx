import Link from "next/link";
import { redirect } from "next/navigation";
import { FileBox, Package, ShoppingCart, UploadCloud } from "lucide-react";
import { LogoutButton } from "@/components/LogoutButton";
import { createServiceSupabaseClient, getCurrentProfile, getCurrentUser, isSupabaseServerConfigured } from "@/lib/supabaseServer";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dashboard"
};

const statCards = [
  { icon: Package, label: "Orders", key: "orders" },
  { icon: FileBox, label: "Uploaded STL files", key: "uploads" },
  { icon: ShoppingCart, label: "Saved cart items", key: "cart" }
];

export default async function DashboardPage() {
  if (!isSupabaseServerConfigured) {
    return (
      <section className="container-px section-y">
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-3 text-4xl font-black">Supabase is not configured yet.</h1>
        <p className="mt-4 text-forge-steel">Add the Supabase environment variables from `.env.example` to enable authentication and dashboard data.</p>
      </section>
    );
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCurrentProfile();
  const supabase = createServiceSupabaseClient();
  const [ordersResult, uploadsResult, cartResult] = await Promise.all([
    supabase?.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
    supabase?.from("uploaded_models").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
    supabase?.from("cart_items").select("id", { count: "exact", head: true }).eq("user_id", user.id)
  ]);

  const orders = ordersResult?.data ?? [];
  const uploads = uploadsResult?.data ?? [];
  const cartCount = cartResult?.count ?? 0;
  const statValues = {
    orders: orders.length,
    uploads: uploads.length,
    cart: cartCount
  };

  return (
    <section className="container-px section-y">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1 className="mt-3 text-4xl font-black">Hi, {profile?.full_name ?? user.email}.</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {statCards.map(({ icon: Icon, label, key }) => (
          <div key={label} className="surface rounded-md p-5">
            <Icon className="h-6 w-6 text-forge-mint" />
            <p className="mt-4 text-sm text-forge-steel">{label}</p>
            <p className="text-3xl font-black">{statValues[key as keyof typeof statValues]}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="surface rounded-md p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Recent orders</h2>
            <Link href="/shop" className="text-sm font-semibold text-forge-mint">Shop</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {orders.length ? orders.map((order) => (
              <div key={order.id} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{order.order_number}</span>
                  <span>{formatCurrency(order.total_amount)}</span>
                </div>
                <p className="mt-1 text-forge-steel">{order.order_status} · {order.payment_status}</p>
              </div>
            )) : <p className="text-sm text-forge-steel">No orders yet.</p>}
          </div>
        </section>

        <section className="surface rounded-md p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold">Uploaded models</h2>
            <Link href="/upload" className="inline-flex items-center gap-2 text-sm font-semibold text-forge-mint">
              <UploadCloud className="h-4 w-4" />
              Upload
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {uploads.length ? uploads.map((model) => (
              <div key={model.id} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
                <div className="flex justify-between gap-3">
                  <span className="font-semibold">{model.file_name}</span>
                  <span>{formatCurrency(model.estimated_price ?? 0)}</span>
                </div>
                <p className="mt-1 text-forge-steel">{model.material} · {model.color} · {model.infill_percentage}% infill</p>
              </div>
            )) : <p className="text-sm text-forge-steel">No STL uploads yet.</p>}
          </div>
        </section>
      </div>
    </section>
  );
}

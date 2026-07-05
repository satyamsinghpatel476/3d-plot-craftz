import { CreditCard, FileBox, Package, Users } from "lucide-react";
import { AdminCategoryManager } from "@/components/AdminCategoryManager";
import { AdminGalleryManager } from "@/components/AdminGalleryManager";
import { AdminProductManager } from "@/components/AdminProductManager";
import { AdminReviewManager } from "@/components/AdminReviewManager";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminStatusSelect } from "@/components/AdminStatusSelect";
import { createServiceSupabaseClient, isSupabaseServerConfigured, requireAdmin } from "@/lib/supabaseServer";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin"
};

const analyticsCards = [
  { icon: Users, label: "Total users", key: "users" },
  { icon: Package, label: "Total orders", key: "orders" },
  { icon: CreditCard, label: "Revenue", key: "revenue" },
  { icon: FileBox, label: "STL uploads", key: "uploads" }
];

export default async function AdminPage() {
  if (!isSupabaseServerConfigured) {
    return (
      <section className="container-px section-y">
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 text-4xl font-black">Supabase is not configured yet.</h1>
        <p className="mt-4 text-forge-steel">Admin features unlock after adding Supabase environment variables and creating an admin profile.</p>
      </section>
    );
  }

  const admin = await requireAdmin();
  const supabase = createServiceSupabaseClient();

  if (!supabase) {
    return (
      <section className="container-px section-y">
        <h1 className="text-4xl font-black">Service role key is missing.</h1>
        <p className="mt-4 text-forge-steel">Set `SUPABASE_SERVICE_ROLE_KEY` for admin analytics and management.</p>
      </section>
    );
  }

  const [users, products, categories, orders, uploads, payments, tickets, reviews, gallery] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("products").select("*").order("created_at", { ascending: false }).limit(50),
    supabase.from("categories").select("*").order("name", { ascending: true }),
    supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("uploaded_models").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("support_tickets").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("reviews").select("*, products(name), profiles(full_name)").order("created_at", { ascending: false }).limit(20),
    supabase.from("gallery_items").select("*").order("created_at", { ascending: false }).limit(20)
  ]);

  const productRows = (products.data ?? []) as Product[];
  const orderRows = orders.data ?? [];
  const revenue = orderRows.reduce((sum, order) => sum + Number(order.payment_status === "paid" ? order.total_amount : 0), 0);
  const pendingOrders = orderRows.filter((order) => order.order_status === "pending").length;
  const analyticsValues = {
    users: users.data?.length ?? 0,
    orders: orderRows.length,
    revenue: formatCurrency(revenue),
    uploads: uploads.data?.length ?? 0
  };

  return (
    <section className="container-px section-y">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-4xl font-black">Operations dashboard.</h1>
          <p className="mt-2 text-forge-steel">Signed in as {admin.full_name ?? admin.email}.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <AdminSidebar />
        <div className="grid gap-8">
          <section id="analytics" className="grid gap-5 md:grid-cols-4">
            {analyticsCards.map(({ icon: Icon, label, key }) => (
              <div key={label} className="surface rounded-md p-5">
                <Icon className="h-6 w-6 text-forge-mint" />
                <p className="mt-4 text-sm text-forge-steel">{label}</p>
                <p className="text-2xl font-black">{analyticsValues[key as keyof typeof analyticsValues]}</p>
              </div>
            ))}
            <div className="surface rounded-md p-5 md:col-span-4">
              <p className="font-semibold">Pending orders: {pendingOrders}</p>
              <p className="mt-1 text-sm text-forge-steel">Best-selling products can be derived from `order_items` once live order volume is available.</p>
            </div>
          </section>

          <section id="users" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Users</h2>
            <div className="mt-5 grid gap-3">
              {(users.data ?? []).map((user) => (
                <div key={user.id} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
                  <p className="font-semibold">{user.full_name ?? user.email}</p>
                  <p className="text-forge-steel">{user.email} · {user.role}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="products" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Products</h2>
            <div className="mt-5">
              <AdminProductManager initialProducts={productRows} />
            </div>
          </section>

          <section id="categories" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Categories</h2>
            <div className="mt-5">
              <AdminCategoryManager initialCategories={categories.data ?? []} />
            </div>
          </section>

          <section id="orders" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Orders</h2>
            <div className="mt-5 grid gap-3">
              {orderRows.map((order) => (
                <div key={order.id} className="grid gap-3 rounded-md border border-black/10 p-3 dark:border-white/10 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div>
                    <p className="font-semibold">{order.order_number}</p>
                    <p className="text-sm text-forge-steel">{order.shipping_name} · {formatCurrency(order.total_amount)} · {order.payment_status}</p>
                  </div>
                  <AdminStatusSelect id={order.id} type="order" initialStatus={order.order_status} options={["pending", "processing", "printing", "shipped", "delivered", "cancelled"]} />
                </div>
              ))}
            </div>
          </section>

          <section id="uploads" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Uploaded STL files</h2>
            <div className="mt-5 grid gap-3">
              {(uploads.data ?? []).map((model) => (
                <div key={model.id} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
                  <p className="font-semibold">{model.file_name}</p>
                  <p className="text-forge-steel">{model.material} · {model.color} · {formatCurrency(model.estimated_price ?? 0)}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="payments" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Payments</h2>
            <div className="mt-5 grid gap-3">
              {(payments.data ?? []).map((payment) => (
                <div key={payment.id} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
                  <p className="font-semibold">{payment.razorpay_payment_id ?? payment.razorpay_order_id}</p>
                  <p className="text-forge-steel">{formatCurrency(payment.amount ?? 0)} · {payment.status}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="tickets" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Help desk tickets</h2>
            <div className="mt-5 grid gap-3">
              {(tickets.data ?? []).map((ticket) => (
                <div key={ticket.id} className="grid gap-3 rounded-md border border-black/10 p-3 text-sm dark:border-white/10 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-semibold">{ticket.subject}</p>
                    <p className="text-forge-steel">{ticket.name} · {ticket.email}</p>
                  </div>
                  <AdminStatusSelect id={ticket.id} type="ticket" initialStatus={ticket.status} options={["open", "in_progress", "resolved"]} />
                </div>
              ))}
            </div>
          </section>

          <section id="reviews" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Reviews</h2>
            <div className="mt-5">
              <AdminReviewManager initialReviews={reviews.data ?? []} />
            </div>
          </section>

          <section id="gallery" className="surface rounded-md p-5">
            <h2 className="text-2xl font-black">Gallery</h2>
            <div className="mt-5">
              <AdminGalleryManager initialItems={gallery.data ?? []} />
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

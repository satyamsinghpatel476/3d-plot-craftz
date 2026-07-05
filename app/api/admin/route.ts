import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient, getCurrentProfile } from "@/lib/supabaseServer";

const adminPatchSchema = z.object({
  type: z.enum(["order", "ticket"]),
  id: z.string().uuid(),
  status: z.string().min(2).max(40)
});

export async function GET() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const [users, orders, uploads, tickets] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total_amount,payment_status", { count: "exact" }),
    supabase.from("uploaded_models").select("id", { count: "exact", head: true }),
    supabase.from("support_tickets").select("id", { count: "exact", head: true }).eq("status", "open")
  ]);

  const revenue = (orders.data ?? []).reduce((sum, order) => sum + (order.payment_status === "paid" ? Number(order.total_amount) : 0), 0);

  return NextResponse.json({
    analytics: {
      totalUsers: users.count ?? 0,
      totalOrders: orders.count ?? 0,
      totalRevenue: revenue,
      uploadedModels: uploads.count ?? 0,
      openTickets: tickets.count ?? 0
    }
  });
}

export async function PATCH(request: Request) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = adminPatchSchema.parse(await request.json());
    const table = payload.type === "order" ? "orders" : "support_tickets";
    const column = payload.type === "order" ? "order_status" : "status";
    const { data, error } = await supabase.from(table).update({ [column]: payload.status }).eq("id", payload.id).select("*").single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid admin update." }, { status: 400 });
  }
}

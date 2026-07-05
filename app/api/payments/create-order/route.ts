import { NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder } from "@/lib/razorpay";
import { createServiceSupabaseClient, getCurrentProfile, getCurrentUser } from "@/lib/supabaseServer";

const paymentOrderSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().min(1).optional()
});

export async function POST(request: Request) {
  try {
    const payload = paymentOrderSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

    const { data: order, error } = await supabase.from("orders").select("*").eq("id", payload.orderId).single();
    if (error || !order) return NextResponse.json({ error: error?.message ?? "Order not found." }, { status: 404 });

    const user = await getCurrentUser();
    const profile = await getCurrentProfile();
    if (order.user_id && order.user_id !== user?.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "You cannot pay for this order." }, { status: 403 });
    }

    const razorpayOrder = await createRazorpayOrder(Number(order.total_amount), order.order_number);

    await supabase.from("payments").insert({
      order_id: order.id,
      razorpay_order_id: razorpayOrder.id,
      amount: Number(order.total_amount),
      status: "created"
    });

    return NextResponse.json({ razorpayOrder });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment order creation failed." }, { status: 400 });
  }
}

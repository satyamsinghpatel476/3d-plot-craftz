import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { createServiceSupabaseClient, getCurrentProfile, getCurrentUser } from "@/lib/supabaseServer";

const verifySchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const payload = verifySchema.parse(await request.json());
    const verified = verifyRazorpaySignature({
      razorpayOrderId: payload.razorpay_order_id,
      razorpayPaymentId: payload.razorpay_payment_id,
      razorpaySignature: payload.razorpay_signature
    });

    if (!verified) {
      return NextResponse.json({ error: "Invalid Razorpay signature." }, { status: 400 });
    }

    const supabase = createServiceSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

    const { data: existingOrder, error: orderLookupError } = await supabase.from("orders").select("id,user_id").eq("id", payload.orderId).single();
    if (orderLookupError || !existingOrder) {
      return NextResponse.json({ error: orderLookupError?.message ?? "Order not found." }, { status: 404 });
    }

    const user = await getCurrentUser();
    const profile = await getCurrentProfile();
    if (existingOrder.user_id && existingOrder.user_id !== user?.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "You cannot verify this order." }, { status: 403 });
    }

    await supabase
      .from("payments")
      .update({
        razorpay_payment_id: payload.razorpay_payment_id,
        razorpay_signature: payload.razorpay_signature,
        status: "paid"
      })
      .eq("order_id", payload.orderId)
      .eq("razorpay_order_id", payload.razorpay_order_id);

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        payment_status: "paid",
        order_status: "processing"
      })
      .eq("id", payload.orderId)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ verified: true, order });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment verification failed." }, { status: 400 });
  }
}

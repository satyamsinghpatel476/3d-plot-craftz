import { NextResponse } from "next/server";
import { createServiceSupabaseClient, getCurrentProfile, getCurrentUser } from "@/lib/supabaseServer";
import { makeOrderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validation";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const profile = await getCurrentProfile();
  const query = supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  const { data, error } = profile?.role === "admin" ? await query : await query.eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ orders: data });
}

export async function POST(request: Request) {
  try {
    const payload = checkoutSchema.parse(await request.json());
    const supabase = createServiceSupabaseClient();
    if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

    const user = await getCurrentUser();
    const productIds = payload.items.flatMap((item) => (item.productId ? [item.productId] : []));
    const { data: productRows, error: productError } = productIds.length
      ? await supabase.from("products").select("id, price").in("id", productIds)
      : { data: [], error: null };

    if (productError) return NextResponse.json({ error: productError.message }, { status: 500 });

    const productPrice = new Map((productRows ?? []).map((product) => [product.id, Number(product.price)]));
    const missingProducts = productIds.filter((id) => !productPrice.has(id));
    if (missingProducts.length) {
      return NextResponse.json({ error: "One or more products are no longer available." }, { status: 400 });
    }

    const orderItems = payload.items.map((item) => {
      const price = item.productId ? productPrice.get(item.productId) ?? item.price : item.price;
      return {
        product_id: item.productId ?? null,
        uploaded_model_id: item.uploadedModelId ?? null,
        quantity: item.quantity,
        price
      };
    });
    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        order_number: makeOrderNumber(),
        total_amount: total,
        payment_status: payload.paymentMethod === "cod" ? "cod" : "pending",
        order_status: "pending",
        payment_method: payload.paymentMethod,
        shipping_name: payload.fullName,
        shipping_phone: payload.phone,
        shipping_email: payload.email,
        shipping_address: payload.address,
        city: payload.city,
        state: payload.state,
        pincode: payload.pincode,
        delivery_notes: payload.deliveryNotes ?? null
      })
      .select("*")
      .single();

    if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

    const { error: itemError } = await supabase.from("order_items").insert(
      orderItems.map((item) => ({
        ...item,
        order_id: order.id
      }))
    );

    if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid checkout payload." }, { status: 400 });
  }
}

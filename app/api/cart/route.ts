import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient, getCurrentUser } from "@/lib/supabaseServer";

const cartSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(0).max(500)
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("cart_items").select("*, products(*)").eq("user_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = cartSchema.parse(await request.json());
    if (payload.quantity <= 0) {
      await supabase.from("cart_items").delete().eq("user_id", user.id).eq("product_id", payload.productId);
      return NextResponse.json({ ok: true });
    }

    const { data, error } = await supabase
      .from("cart_items")
      .upsert({ user_id: user.id, product_id: payload.productId, quantity: payload.quantity }, { onConflict: "user_id,product_id" })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid cart payload." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const query = supabase.from("cart_items").delete().eq("user_id", user.id);
  const { error } = productId ? await query.eq("product_id", productId) : await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

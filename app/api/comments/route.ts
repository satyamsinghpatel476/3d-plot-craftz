import { NextResponse } from "next/server";
import { createServiceSupabaseClient, getCurrentUser } from "@/lib/supabaseServer";
import { reviewSchema } from "@/lib/validation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId is required." }, { status: 400 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ reviews: [] });

  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login is required to comment." }, { status: 401 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = reviewSchema.parse(await request.json());
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        product_id: payload.productId,
        rating: payload.rating,
        comment: payload.comment
      })
      .select("*, profiles(full_name)")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ review: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid review payload." }, { status: 400 });
  }
}

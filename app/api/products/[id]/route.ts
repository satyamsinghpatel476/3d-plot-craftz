import { NextResponse } from "next/server";
import { getProductByIdOrSlug } from "@/lib/data";
import { createServiceSupabaseClient, getCurrentProfile } from "@/lib/supabaseServer";
import { productSchema } from "@/lib/validation";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const product = await getProductByIdOrSlug(params.id);
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = productSchema.parse(await request.json());
    const { data, error } = await supabase.from("products").update(payload).eq("id", params.id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ product: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid product payload." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const { error } = await supabase.from("products").update({ is_active: false }).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

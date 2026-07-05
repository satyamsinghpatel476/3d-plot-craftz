import { NextResponse } from "next/server";
import { sampleProducts } from "@/lib/demoData";
import { createServiceSupabaseClient, getCurrentProfile } from "@/lib/supabaseServer";
import { productSchema } from "@/lib/validation";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ products: sampleProducts });

  const { data, error } = await supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ products: data });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = productSchema.parse(await request.json());
    const { data, error } = await supabase.from("products").insert(payload).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid product payload." }, { status: 400 });
  }
}

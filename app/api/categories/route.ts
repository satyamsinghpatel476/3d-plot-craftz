import { NextResponse } from "next/server";
import { createServiceSupabaseClient, getCurrentProfile } from "@/lib/supabaseServer";
import { categorySchema } from "@/lib/validation";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ categories: [] });

  const { data, error } = await supabase.from("categories").select("*").order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ categories: data });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = categorySchema.parse(await request.json());
    const { data, error } = await supabase.from("categories").insert(payload).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ category: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid category payload." }, { status: 400 });
  }
}

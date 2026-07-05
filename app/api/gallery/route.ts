import { NextResponse } from "next/server";
import { createServiceSupabaseClient, getCurrentProfile } from "@/lib/supabaseServer";
import { galleryItemSchema } from "@/lib/validation";

export async function GET() {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ galleryItems: [] });

  const { data, error } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ galleryItems: data });
}

export async function POST(request: Request) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = galleryItemSchema.parse(await request.json());
    const { data, error } = await supabase.from("gallery_items").insert(payload).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ galleryItem: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid gallery payload." }, { status: 400 });
  }
}

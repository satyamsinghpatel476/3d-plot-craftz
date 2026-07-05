import { NextResponse } from "next/server";
import { createServiceSupabaseClient, getCurrentProfile } from "@/lib/supabaseServer";
import { galleryItemSchema } from "@/lib/validation";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = galleryItemSchema.parse(await request.json());
    const { data, error } = await supabase.from("gallery_items").update(payload).eq("id", params.id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ galleryItem: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid gallery payload." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const { error } = await supabase.from("gallery_items").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

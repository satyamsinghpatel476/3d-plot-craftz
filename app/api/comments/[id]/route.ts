import { NextResponse } from "next/server";
import { createServiceSupabaseClient, getCurrentProfile } from "@/lib/supabaseServer";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const { error } = await supabase.from("reviews").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

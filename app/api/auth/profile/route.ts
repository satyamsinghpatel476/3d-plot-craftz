import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceSupabaseClient, getCurrentUser } from "@/lib/supabaseServer";

const profileUpdateSchema = z.object({
  full_name: z.string().min(2).max(120).optional(),
  phone: z.string().max(20).optional()
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ profile: data });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = profileUpdateSchema.parse(await request.json());
    const { data, error } = await supabase.from("profiles").update(payload).eq("id", user.id).select("*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ profile: data });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid profile payload." }, { status: 400 });
  }
}

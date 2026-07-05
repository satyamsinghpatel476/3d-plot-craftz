import { NextResponse } from "next/server";
import { createServiceSupabaseClient, getCurrentProfile, getCurrentUser } from "@/lib/supabaseServer";
import { supportTicketSchema } from "@/lib/validation";

export async function GET() {
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  const { data, error } = await supabase.from("support_tickets").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tickets: data });
}

export async function POST(request: Request) {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });

  try {
    const payload = supportTicketSchema.parse(await request.json());
    const user = await getCurrentUser();
    const { data, error } = await supabase
      .from("support_tickets")
      .insert({
        user_id: user?.id ?? null,
        name: payload.name,
        email: payload.email,
        phone: payload.phone || null,
        subject: payload.subject,
        message: payload.message,
        status: "open"
      })
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ticket: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid support ticket payload." }, { status: 400 });
  }
}

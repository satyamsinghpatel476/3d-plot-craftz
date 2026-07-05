import { NextResponse } from "next/server";
import { getAIRecommendation } from "@/lib/aiRecommendation";
import { createServiceSupabaseClient, getCurrentUser } from "@/lib/supabaseServer";
import { aiRecommendationInputSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = aiRecommendationInputSchema.parse(body);
    const recommendation = await getAIRecommendation(input);

    const supabase = createServiceSupabaseClient();
    const user = await getCurrentUser();

    if (supabase) {
      await supabase.from("ai_recommendation_requests").insert({
        user_id: user?.id ?? null,
        input,
        recommendation
      });
    }

    return NextResponse.json({ recommendation });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid recommendation request" }, { status: 400 });
  }
}

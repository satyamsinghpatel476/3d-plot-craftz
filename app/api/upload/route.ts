import { NextResponse } from "next/server";
import { getAIRecommendation } from "@/lib/aiRecommendation";
import { calculatePrintPrice } from "@/lib/priceCalculator";
import { createServiceSupabaseClient, getCurrentUser } from "@/lib/supabaseServer";
import { estimateModelFromFileSize } from "@/lib/utils";
import { uploadOptionsSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Login is required to upload STL files." }, { status: 401 });
    }

    const supabase = createServiceSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase service role key is not configured." }, { status: 500 });
    }

    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "STL file is required." }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".stl")) {
      return NextResponse.json({ error: "Only .stl files are accepted." }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "STL uploads are limited to 50 MB." }, { status: 400 });
    }

    const options = uploadOptionsSchema.parse(Object.fromEntries(form.entries()));
    const estimate = estimateModelFromFileSize(file.size);
    const price = calculatePrintPrice({
      material: options.material,
      color: options.color,
      densityMode: options.densityMode,
      infillPercentage: options.infillPercentage,
      quantity: options.quantity,
      urgency: options.urgency,
      finishing: options.finishing,
      weightGrams: estimate.estimatedWeight,
      printTimeHours: estimate.estimatedTime
    });
    const aiSuggestions = await getAIRecommendation({
      material: options.material,
      color: options.color,
      densityMode: options.densityMode,
      infillPercentage: options.infillPercentage,
      purpose: options.purpose,
      objectType: options.objectType,
      budgetPreference: "balanced",
      strengthPreference: options.densityMode === "Solid" ? "high" : "medium",
      fileSizeMb: estimate.fileSizeMb,
      estimatedWeight: price.estimatedWeight
    });

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${user.id}/${Date.now()}-${safeName}`;
    const { error: uploadError } = await supabase.storage.from("stl-files").upload(path, file, {
      contentType: "model/stl",
      upsert: false
    });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from("stl-files").getPublicUrl(path);
    const { data: model, error: insertError } = await supabase
      .from("uploaded_models")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrlData.publicUrl,
        file_size: file.size,
        material: options.material,
        color: options.color,
        infill_percentage: options.infillPercentage,
        hollow_or_solid: options.densityMode,
        estimated_weight: price.estimatedWeight,
        estimated_time: price.estimatedTime,
        estimated_price: price.total,
        ai_suggestions: aiSuggestions
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ model, quote: price, aiSuggestions });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}

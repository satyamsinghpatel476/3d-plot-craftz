import type { AIRecommendationInput, AIRecommendationOutput, DensityMode, Material } from "@/lib/types";

const materialByIntent: Record<string, Material> = {
  decorative: "PLA",
  display: "PLA",
  prototype: "PLA",
  robotics: "PETG",
  robot: "PETG",
  engineering: "PETG",
  load: "ABS",
  bearing: "ABS",
  heat: "ABS",
  flexible: "TPU",
  gasket: "TPU",
  miniature: "Resin",
  detail: "Resin"
};

export async function getAIRecommendation(input: AIRecommendationInput): Promise<AIRecommendationOutput> {
  const fallback = createRuleBasedRecommendation(input);
  const provider = process.env.AI_PROVIDER?.toLowerCase();

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    return { ...fallback, provider: "openai-ready" };
  }

  if (provider === "gemini" && process.env.GEMINI_API_KEY) {
    return { ...fallback, provider: "gemini-ready" };
  }

  return fallback;
}

export function createRuleBasedRecommendation(input: AIRecommendationInput): AIRecommendationOutput {
  const text = `${input.purpose} ${input.objectType}`.toLowerCase();
  let recommendedMaterial: Material = input.material ?? "PLA";
  let recommendedInfill = clamp(input.infillPercentage || 20, 10, 100);
  let hollowOrSolid: DensityMode = input.densityMode;

  for (const [keyword, material] of Object.entries(materialByIntent)) {
    if (text.includes(keyword)) {
      recommendedMaterial = material;
      break;
    }
  }

  if (text.includes("decor") || text.includes("display") || text.includes("figurine")) {
    hollowOrSolid = "Hollow";
    recommendedInfill = clamp(recommendedInfill, 10, 25);
  }

  if (text.includes("robot") || text.includes("gear") || text.includes("fixture")) {
    recommendedMaterial = recommendedMaterial === "ABS" ? "ABS" : "PETG";
    hollowOrSolid = "Custom infill";
    recommendedInfill = clamp(Math.max(recommendedInfill, 45), 40, 70);
  }

  if (input.strengthPreference === "high" || text.includes("load") || text.includes("bearing")) {
    recommendedMaterial = recommendedMaterial === "TPU" ? "TPU" : "PETG";
    hollowOrSolid = "Solid";
    recommendedInfill = Math.max(recommendedInfill, 70);
  }

  if (text.includes("heat") || text.includes("car") || text.includes("enclosure")) {
    recommendedMaterial = "ABS";
    recommendedInfill = Math.max(recommendedInfill, 45);
  }

  if (text.includes("flex") || text.includes("seal") || text.includes("gasket")) {
    recommendedMaterial = "TPU";
    hollowOrSolid = "Custom infill";
    recommendedInfill = clamp(recommendedInfill, 20, 45);
  }

  if (input.budgetPreference === "low" && recommendedMaterial !== "TPU") {
    recommendedMaterial = recommendedMaterial === "Resin" ? "PLA" : recommendedMaterial;
    recommendedInfill = Math.min(recommendedInfill, 35);
    hollowOrSolid = hollowOrSolid === "Solid" ? "Custom infill" : hollowOrSolid;
  }

  const isLarge = (input.fileSizeMb ?? 0) > 45 || (input.estimatedWeight ?? 0) > 350;
  const supportStructureSuggestion = input.overhangRisk
    ? "Enable supports and consider tree supports for clean removal around overhangs."
    : "Supports may be minimal; orient the part with the largest flat face on the bed.";
  const riskWarning = [
    isLarge ? "Large part detected: split into keyed sections to reduce warping and failed prints." : "",
    input.thinWalls ? "Thin wall risk: increase wall thickness to at least 1.2 mm for FDM prints." : "",
    input.strengthPreference === "high" && recommendedMaterial === "PLA" ? "PLA can be brittle under load; PETG or ABS is safer." : ""
  ]
    .filter(Boolean)
    .join(" ");

  return {
    recommendedMaterial,
    recommendedInfill,
    hollowOrSolid,
    strengthRating:
      recommendedMaterial === "TPU"
        ? "Flexible"
        : recommendedInfill >= 65 || hollowOrSolid === "Solid"
          ? "High strength"
          : recommendedInfill >= 30
            ? "Balanced"
            : "Light duty",
    costSavingSuggestion:
      hollowOrSolid === "Hollow"
        ? "Keep the model hollow with 2-3 perimeters to reduce material cost without losing surface quality."
        : "Use adaptive infill and print only stress zones at higher density where the slicer supports it.",
    printQualitySuggestion:
      recommendedMaterial === "Resin"
        ? "Use resin for high-detail surfaces and post-cure after washing."
        : "Use 0.16-0.20 mm layer height for a good balance of detail, strength, and print time.",
    supportStructureSuggestion,
    riskWarning: riskWarning || "No major risk detected from the submitted metadata.",
    stlImprovementSuggestion: input.thinWalls
      ? "Thicken thin walls, repair non-manifold edges, and add small fillets to stress corners."
      : "Run mesh repair, check normals, and add chamfers on sharp load-bearing edges.",
    provider: "rule-based"
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

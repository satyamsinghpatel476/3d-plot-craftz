export type Material = "PLA" | "PETG" | "ABS" | "TPU" | "Resin";

export type PrintColor =
  | "White"
  | "Black"
  | "Red"
  | "Blue"
  | "Green"
  | "Yellow"
  | "Grey"
  | "Orange"
  | "Transparent"
  | "Custom color";

export type DensityMode = "Hollow" | "Solid" | "Custom infill";
export type Urgency = "standard" | "express" | "priority";
export type FinishingOption = "Normal" | "Sanding" | "Painting" | "Premium finish";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  category: string;
  product_type: string;
  price: number;
  stock: number;
  image_url: string;
  material: Material | string;
  color: PrintColor | string;
  dimensions?: string | null;
  rating?: number;
  is_active?: boolean;
  created_at?: string;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type PricingInput = {
  material: Material;
  color: PrintColor;
  weightGrams: number;
  printTimeHours: number;
  infillPercentage: number;
  densityMode: DensityMode;
  quantity: number;
  urgency: Urgency;
  finishing: FinishingOption;
};

export type PricingBreakdown = {
  materialCost: number;
  machineCost: number;
  densityAdjustment: number;
  finishingCost: number;
  urgencyCost: number;
  colorCost: number;
  subtotal: number;
  tax: number;
  total: number;
  estimatedWeight: number;
  estimatedTime: number;
};

export type AIRecommendationInput = {
  material?: Material;
  color?: PrintColor;
  purpose: string;
  objectType: string;
  densityMode: DensityMode;
  infillPercentage: number;
  budgetPreference: "low" | "balanced" | "premium";
  strengthPreference: "light" | "medium" | "high";
  fileSizeMb?: number;
  estimatedWeight?: number;
  overhangRisk?: boolean;
  thinWalls?: boolean;
};

export type AIRecommendationOutput = {
  recommendedMaterial: Material;
  recommendedInfill: number;
  hollowOrSolid: DensityMode;
  strengthRating: "Light duty" | "Balanced" | "High strength" | "Flexible";
  costSavingSuggestion: string;
  printQualitySuggestion: string;
  supportStructureSuggestion: string;
  riskWarning: string;
  stlImprovementSuggestion: string;
  provider: "rule-based" | "openai-ready" | "gemini-ready";
};

export type OrderStatus = "pending" | "processing" | "printing" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "cod" | "refunded";

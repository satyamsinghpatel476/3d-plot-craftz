import type { DensityMode, FinishingOption, Material, PricingBreakdown, PricingInput, PrintColor, Urgency } from "@/lib/types";

export const pricingConfig = {
  baseHandlingFee: 99,
  machineHourlyRate: 70,
  gstRate: 0.18,
  minimumOrderValue: 249,
  materialRatePerGram: {
    PLA: 4,
    PETG: 5.5,
    ABS: 6,
    TPU: 7.5,
    Resin: 8.5
  } satisfies Record<Material, number>,
  densityMultiplier: {
    Hollow: 0.62,
    Solid: 1.25,
    "Custom infill": 1
  } satisfies Record<DensityMode, number>,
  urgencyMultiplier: {
    standard: 1,
    express: 1.2,
    priority: 1.45
  } satisfies Record<Urgency, number>,
  finishingFlatFee: {
    Normal: 0,
    Sanding: 149,
    Painting: 299,
    "Premium finish": 499
  } satisfies Record<FinishingOption, number>,
  colorSurcharge: {
    White: 0,
    Black: 0,
    Red: 20,
    Blue: 20,
    Green: 20,
    Yellow: 20,
    Grey: 0,
    Orange: 25,
    Transparent: 60,
    "Custom color": 120
  } satisfies Record<PrintColor, number>
};

export function calculatePrintPrice(input: PricingInput): PricingBreakdown {
  const quantity = Math.max(1, input.quantity);
  const infillMultiplier = input.densityMode === "Custom infill" ? 0.55 + input.infillPercentage / 100 : 1;
  const effectiveWeight = Math.max(1, input.weightGrams) * pricingConfig.densityMultiplier[input.densityMode] * infillMultiplier;
  const effectiveTime = Math.max(0.5, input.printTimeHours) * pricingConfig.densityMultiplier[input.densityMode] * (0.8 + input.infillPercentage / 125);
  const materialCost = effectiveWeight * pricingConfig.materialRatePerGram[input.material] * quantity;
  const machineCost = effectiveTime * pricingConfig.machineHourlyRate * quantity;
  const densityAdjustment = input.densityMode === "Solid" ? 90 * quantity : input.densityMode === "Hollow" ? -35 * quantity : 0;
  const finishingCost = pricingConfig.finishingFlatFee[input.finishing] * quantity;
  const colorCost = pricingConfig.colorSurcharge[input.color] * quantity;
  const beforeUrgency = pricingConfig.baseHandlingFee + materialCost + machineCost + densityAdjustment + finishingCost + colorCost;
  const urgencyCost = beforeUrgency * (pricingConfig.urgencyMultiplier[input.urgency] - 1);
  const subtotal = Math.max(pricingConfig.minimumOrderValue, beforeUrgency + urgencyCost);
  const tax = subtotal * pricingConfig.gstRate;
  const total = subtotal + tax;

  return {
    materialCost: round(materialCost),
    machineCost: round(machineCost),
    densityAdjustment: round(densityAdjustment),
    finishingCost: round(finishingCost),
    urgencyCost: round(urgencyCost),
    colorCost: round(colorCost),
    subtotal: round(subtotal),
    tax: round(tax),
    total: round(total),
    estimatedWeight: round(effectiveWeight),
    estimatedTime: round(effectiveTime)
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

"use client";

import { FormEvent, useState } from "react";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { materials, printColors } from "@/lib/siteConfig";
import type { AIRecommendationOutput, DensityMode, Material, PrintColor } from "@/lib/types";

export function AIRecommendation() {
  const [material, setMaterial] = useState<Material>("PLA");
  const [color, setColor] = useState<PrintColor>("White");
  const [densityMode, setDensityMode] = useState<DensityMode>("Custom infill");
  const [infillPercentage, setInfillPercentage] = useState(25);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIRecommendationOutput | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setResult(null);

    const response = await fetch("/api/ai-recommendation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        material,
        color,
        densityMode,
        infillPercentage,
        purpose: String(form.get("purpose") ?? ""),
        objectType: String(form.get("objectType") ?? ""),
        budgetPreference: String(form.get("budgetPreference") ?? "balanced"),
        strengthPreference: String(form.get("strengthPreference") ?? "medium"),
        fileSizeMb: Number(form.get("fileSizeMb") || 0),
        overhangRisk: form.get("overhangRisk") === "on",
        thinWalls: form.get("thinWalls") === "on"
      })
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Recommendation failed");
      return;
    }

    setResult(payload.recommendation);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <form onSubmit={handleSubmit} className="surface rounded-md p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-forge-mint/12 text-forge-mint">
            <BrainCircuit className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-xl font-bold">AI print recommendation</h2>
            <p className="text-sm text-forge-steel">Rule-based today, provider-ready for Gemini or OpenAI later.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">Purpose</span>
            <input name="purpose" required className="field" placeholder="decorative, robotics, load-bearing..." />
          </label>
          <label className="grid gap-2">
            <span className="label">Object type</span>
            <input name="objectType" required className="field" placeholder="bracket, miniature, enclosure..." />
          </label>
          <label className="grid gap-2">
            <span className="label">Material</span>
            <select className="field" value={material} onChange={(event) => setMaterial(event.target.value as Material)}>
              {materials.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">Print density</span>
            <select className="field" value={densityMode} onChange={(event) => setDensityMode(event.target.value as DensityMode)}>
              <option>Hollow</option>
              <option>Solid</option>
              <option>Custom infill</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">Budget preference</span>
            <select name="budgetPreference" className="field">
              <option value="balanced">Balanced</option>
              <option value="low">Low cost</option>
              <option value="premium">Premium</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">Strength preference</span>
            <select name="strengthPreference" className="field">
              <option value="medium">Medium</option>
              <option value="light">Light</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">File size (MB)</span>
            <input name="fileSizeMb" type="number" min="0" step="0.1" className="field" placeholder="Optional" />
          </label>
          <label className="grid gap-2">
            <span className="label">Infill: {infillPercentage}%</span>
            <input type="range" min="10" max="100" value={infillPercentage} onChange={(event) => setInfillPercentage(Number(event.target.value))} />
          </label>
        </div>

        <div className="mt-5">
          <span className="label">Color</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {printColors.map((swatch) => (
              <button
                key={swatch.id}
                type="button"
                title={swatch.label}
                aria-label={swatch.label}
                onClick={() => setColor(swatch.id)}
                className={`h-9 w-9 rounded-md border ${color === swatch.id ? "border-forge-mint ring-2 ring-forge-mint/25" : "border-black/10 dark:border-white/15"}`}
                style={{ background: swatch.value }}
              />
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-forge-steel">
            <input name="overhangRisk" type="checkbox" className="h-4 w-4 accent-forge-mint" />
            Overhang risk
          </label>
          <label className="flex items-center gap-2 text-sm text-forge-steel">
            <input name="thinWalls" type="checkbox" className="h-4 w-4 accent-forge-mint" />
            Thin walls
          </label>
        </div>

        <button disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate recommendation
        </button>
      </form>

      <div className="surface rounded-md p-5 sm:p-6">
        {result ? (
          <div>
            <p className="eyebrow">Recommendation</p>
            <h2 className="mt-3 text-3xl font-black">{result.recommendedMaterial} · {result.recommendedInfill}%</h2>
            <div className="mt-6 grid gap-4">
              {[
                ["Density", result.hollowOrSolid],
                ["Strength", result.strengthRating],
                ["Cost", result.costSavingSuggestion],
                ["Quality", result.printQualitySuggestion],
                ["Supports", result.supportStructureSuggestion],
                ["Risk", result.riskWarning],
                ["STL improvement", result.stlImprovementSuggestion],
                ["Provider", result.provider]
              ].map(([label, value]) => (
                <div key={label} className="rounded-md border border-black/10 p-3 text-sm dark:border-white/10">
                  <p className="font-semibold">{label}</p>
                  <p className="mt-1 text-forge-steel">{value}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid min-h-[480px] place-items-center text-center">
            <div>
              <BrainCircuit className="mx-auto h-12 w-12 text-forge-mint" />
              <h2 className="mt-4 text-2xl font-bold">Print intelligence panel</h2>
              <p className="mt-2 max-w-sm text-sm text-forge-steel">Submit print metadata to get material, infill, support, risk, and cost recommendations.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { BrainCircuit, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { ModelViewer } from "@/components/ModelViewer";
import { calculatePrintPrice } from "@/lib/priceCalculator";
import { materials, printColors } from "@/lib/siteConfig";
import type { DensityMode, FinishingOption, Material, PrintColor, Urgency } from "@/lib/types";
import { bytesToMb, estimateModelFromFileSize, formatCurrency } from "@/lib/utils";

const densityDescriptions: Record<DensityMode, string> = {
  Hollow: "Cheaper and lighter for display parts.",
  Solid: "Stronger but more expensive.",
  "Custom infill": "Balanced strength, weight, and cost."
};

export function UploadWorkbench() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [material, setMaterial] = useState<Material>("PLA");
  const [color, setColor] = useState<PrintColor>("White");
  const [densityMode, setDensityMode] = useState<DensityMode>("Custom infill");
  const [infillPercentage, setInfillPercentage] = useState(25);
  const [quantity, setQuantity] = useState(1);
  const [urgency, setUrgency] = useState<Urgency>("standard");
  const [finishing, setFinishing] = useState<FinishingOption>("Normal");
  const [purpose, setPurpose] = useState("functional prototype");
  const [objectType, setObjectType] = useState("custom part");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    if (!selected) return;

    const isStl = selected.name.toLowerCase().endsWith(".stl") || selected.type === "model/stl";
    if (!isStl) {
      toast.error("Please upload a .stl file");
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      toast.error("STL uploads are limited to 50 MB");
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  const estimate = useMemo(() => estimateModelFromFileSize(file?.size ?? 2_500_000), [file]);
  const price = useMemo(
    () =>
      calculatePrintPrice({
        material,
        color,
        weightGrams: estimate.estimatedWeight,
        printTimeHours: estimate.estimatedTime,
        infillPercentage,
        densityMode,
        quantity,
        urgency,
        finishing
      }),
    [color, densityMode, estimate.estimatedTime, estimate.estimatedWeight, finishing, infillPercentage, material, quantity, urgency]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      toast.error("Select an STL file first");
      return;
    }

    const form = new FormData();
    form.set("file", file);
    form.set("material", material);
    form.set("color", color);
    form.set("densityMode", densityMode);
    form.set("infillPercentage", String(infillPercentage));
    form.set("quantity", String(quantity));
    form.set("urgency", urgency);
    form.set("finishing", finishing);
    form.set("purpose", purpose);
    form.set("objectType", objectType);

    setLoading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: form
    });

    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      toast.error(payload.error ?? "Upload failed");
      return;
    }

    toast.success("STL uploaded and quote saved");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
      <div>
        <ModelViewer modelUrl={previewUrl} />
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm text-forge-steel">File size</p>
            <p className="text-xl font-black">{file ? `${bytesToMb(file.size)} MB` : "Preview"}</p>
          </div>
          <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm text-forge-steel">Material usage</p>
            <p className="text-xl font-black">{price.estimatedWeight} g</p>
          </div>
          <div className="rounded-md border border-black/10 p-4 dark:border-white/10">
            <p className="text-sm text-forge-steel">Print time</p>
            <p className="text-xl font-black">{price.estimatedTime} h</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="surface rounded-md p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <UploadCloud className="h-6 w-6 text-forge-mint" />
          <h1 className="text-2xl font-black">Upload STL</h1>
        </div>
        <label className="mt-6 grid cursor-pointer place-items-center rounded-md border border-dashed border-black/20 p-8 text-center transition hover:border-forge-mint dark:border-white/20">
          <UploadCloud className="h-10 w-10 text-forge-mint" />
          <span className="mt-3 font-semibold">{file?.name ?? "Choose STL file"}</span>
          <span className="mt-1 text-sm text-forge-steel">Max 50 MB</span>
          <input type="file" accept=".stl,model/stl" className="sr-only" onChange={handleFileChange} />
        </label>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="label">Purpose</span>
            <input className="field" value={purpose} onChange={(event) => setPurpose(event.target.value)} />
          </label>
          <label className="grid gap-2">
            <span className="label">Object type</span>
            <input className="field" value={objectType} onChange={(event) => setObjectType(event.target.value)} />
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
            <span className="label">Quantity</span>
            <input className="field" type="number" min="1" max="500" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
          </label>
          <label className="grid gap-2">
            <span className="label">Urgency</span>
            <select className="field" value={urgency} onChange={(event) => setUrgency(event.target.value as Urgency)}>
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="priority">Priority</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="label">Finishing</span>
            <select className="field" value={finishing} onChange={(event) => setFinishing(event.target.value as FinishingOption)}>
              <option>Normal</option>
              <option>Sanding</option>
              <option>Painting</option>
              <option>Premium finish</option>
            </select>
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

        <div className="mt-5 grid gap-3">
          {(["Hollow", "Solid", "Custom infill"] as DensityMode[]).map((mode) => (
            <button
              type="button"
              key={mode}
              onClick={() => setDensityMode(mode)}
              className={`rounded-md border p-3 text-left transition ${densityMode === mode ? "border-forge-mint bg-forge-mint/10" : "border-black/10 dark:border-white/10"}`}
            >
              <span className="font-semibold">{mode}</span>
              <span className="mt-1 block text-sm text-forge-steel">{densityDescriptions[mode]}</span>
            </button>
          ))}
        </div>

        <label className="mt-5 grid gap-2">
          <span className="label">Infill: {infillPercentage}%</span>
          <input type="range" min="10" max="100" value={infillPercentage} onChange={(event) => setInfillPercentage(Number(event.target.value))} />
        </label>

        <div className="mt-6 rounded-md bg-forge-ink p-5 text-white dark:bg-white dark:text-forge-ink">
          <div className="flex items-center gap-2 text-sm font-semibold text-forge-mint">
            <BrainCircuit className="h-4 w-4" />
            Estimated quote
          </div>
          <p className="mt-2 text-4xl font-black">{formatCurrency(price.total)}</p>
          <p className="mt-2 text-sm opacity-75">Includes material, machine time, finishing, urgency, and GST estimate.</p>
        </div>

        <button disabled={loading} className="btn-primary mt-6 w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Save upload and quote
        </button>
      </form>
    </div>
  );
}

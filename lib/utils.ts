import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function makeOrderNumber() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PF3D-${stamp}-${random}`;
}

export function bytesToMb(bytes: number) {
  return Number((bytes / 1024 / 1024).toFixed(2));
}

export function estimateModelFromFileSize(fileSizeBytes: number) {
  const fileSizeMb = bytesToMb(fileSizeBytes);
  const estimatedWeight = Math.max(8, Math.round(fileSizeMb * 9));
  const estimatedTime = Math.max(1, Number((estimatedWeight / 18).toFixed(1)));

  return {
    fileSizeMb,
    estimatedWeight,
    estimatedTime
  };
}

export function isServerEnvConfigured(...keys: string[]) {
  return keys.every((key) => Boolean(process.env[key]));
}

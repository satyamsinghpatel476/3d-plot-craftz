import { cache } from "react";
import { sampleGallery, sampleProducts } from "@/lib/demoData";
import { createServiceSupabaseClient } from "@/lib/supabaseServer";
import type { Product } from "@/lib/types";

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const getProducts = cache(async (): Promise<Product[]> => {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return sampleProducts;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data?.length) return sampleProducts;
  return data as Product[];
});

export const getProductByIdOrSlug = cache(async (idOrSlug: string): Promise<Product | null> => {
  const supabase = createServiceSupabaseClient();
  if (supabase) {
    const query = supabase.from("products").select("*");
    const { data } = uuidPattern.test(idOrSlug) ? await query.eq("id", idOrSlug).single() : await query.eq("slug", idOrSlug).single();

    if (data) return data as Product;
  }

  return sampleProducts.find((product) => product.id === idOrSlug || product.slug === idOrSlug) ?? null;
});

export const getGalleryItems = cache(async () => {
  const supabase = createServiceSupabaseClient();
  if (!supabase) return sampleGallery;

  const { data, error } = await supabase.from("gallery_items").select("*").order("created_at", { ascending: false });
  if (error || !data?.length) return sampleGallery;
  return data;
});

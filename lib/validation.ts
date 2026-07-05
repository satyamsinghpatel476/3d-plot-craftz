import { z } from "zod";

export const materialSchema = z.enum(["PLA", "PETG", "ABS", "TPU", "Resin"]);
export const colorSchema = z.enum(["White", "Black", "Red", "Blue", "Green", "Yellow", "Grey", "Orange", "Transparent", "Custom color"]);
export const densitySchema = z.enum(["Hollow", "Solid", "Custom infill"]);
export const finishingSchema = z.enum(["Normal", "Sanding", "Painting", "Premium finish"]);
export const urgencySchema = z.enum(["standard", "express", "priority"]);

export const aiRecommendationInputSchema = z.object({
  material: materialSchema.optional(),
  color: colorSchema.optional(),
  purpose: z.string().min(2).max(160),
  objectType: z.string().min(2).max(120),
  densityMode: densitySchema,
  infillPercentage: z.coerce.number().min(10).max(100),
  budgetPreference: z.enum(["low", "balanced", "premium"]),
  strengthPreference: z.enum(["light", "medium", "high"]),
  fileSizeMb: z.coerce.number().min(0).optional(),
  estimatedWeight: z.coerce.number().min(0).optional(),
  overhangRisk: z.coerce.boolean().optional(),
  thinWalls: z.coerce.boolean().optional()
});

export const uploadOptionsSchema = z.object({
  material: materialSchema.default("PLA"),
  color: colorSchema.default("White"),
  densityMode: densitySchema.default("Custom infill"),
  infillPercentage: z.coerce.number().min(10).max(100).default(25),
  quantity: z.coerce.number().int().min(1).max(500).default(1),
  urgency: urgencySchema.default("standard"),
  finishing: finishingSchema.default("Normal"),
  purpose: z.string().max(160).optional().default("custom 3D print"),
  objectType: z.string().max(120).optional().default("uploaded STL")
});

export const checkoutSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  address: z.string().min(6).max(260),
  city: z.string().min(2).max(80),
  state: z.string().min(2).max(80),
  pincode: z.string().min(4).max(12),
  deliveryNotes: z.string().max(300).optional(),
  paymentMethod: z.enum(["razorpay", "cod", "quote"]),
  items: z
    .array(
      z.object({
        productId: z.string().uuid().optional(),
        uploadedModelId: z.string().uuid().optional(),
        quantity: z.number().int().min(1).max(500),
        price: z.number().min(0)
      })
    )
    .min(1)
});

export const supportTicketSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(8).max(20).optional().or(z.literal("")),
  subject: z.string().min(4).max(160),
  message: z.string().min(10).max(1000)
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().min(2).max(800)
});

export const productSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(180),
  description: z.string().min(10),
  category: z.string().min(2),
  product_type: z.string().min(2),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  image_url: z.string().min(1),
  material: z.string().min(2),
  color: z.string().min(2),
  dimensions: z.string().optional(),
  is_active: z.coerce.boolean().default(true)
});

export const categorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140),
  description: z.string().max(500).optional().or(z.literal("")),
  image_url: z.string().max(500).optional().or(z.literal(""))
});

export const galleryItemSchema = z.object({
  title: z.string().min(2).max(160),
  image_url: z.string().min(1).max(500),
  material: z.string().min(2).max(80),
  print_time: z.string().min(1).max(80),
  purpose: z.string().min(2).max(160),
  description: z.string().min(10).max(1000),
  category: z.string().max(120).optional().or(z.literal(""))
});

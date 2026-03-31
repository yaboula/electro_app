import { z } from "zod";

// ── Auth ──────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe trop court"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ── Products ──────────────────────────────────────────
export const PLATFORMS = [
  "PS5", "PS4", "Xbox Series", "Xbox One", "Nintendo Switch", "PC", "Accessoire",
] as const;

export const PRODUCT_TYPES = ["console", "game", "accessory"] as const;

export const productSchema = z.object({
  title: z.string().min(3, "Minimum 3 caractères"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug invalide (minuscules, chiffres et tirets)"),
  platform: z.enum(PLATFORMS),
  type: z.enum(PRODUCT_TYPES),
  base_description: z.string().min(10, "Description trop courte"),
  is_published: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ── Inventory ─────────────────────────────────────────
export const CONDITIONS = ["NUEVO", "USADO_A", "USADO_B"] as const;

export const inventoryItemSchema = z
  .object({
    product_id: z.string().uuid("Produit requis"),
    condition: z.enum(CONDITIONS),
    serial_number: z.string().optional(),
    grade_notes: z.string().optional(),
    stock_quantity: z.number().int().min(0, "Quantité invalide"),
    price: z.number().positive("Le prix doit être positif"),
    is_active: z.boolean().default(true),
  })
  .refine(
    (d) => d.condition === "NUEVO" || (d.serial_number && d.serial_number.length > 0),
    { message: "N° de série obligatoire pour les occasions", path: ["serial_number"] }
  );

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>;

// ── Checkout ──────────────────────────────────────────
export const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Nador",
  "Mohammédia", "El Jadida", "Béni Mellal", "Taza", "Khouribga",
  "Settat", "Laâyoune", "Safi", "Khémisset", "Guelmim",
  "Berrechid", "Errachidia", "Taourirt", "Autre",
] as const;

export const moroccanPhoneSchema = z
  .string()
  .regex(
    /^(?:\+212|0)([ \-]?)(?:5|6|7)\d{8}$/,
    "Numéro de téléphone marocain invalide"
  );

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Nom trop long"),
  phone: moroccanPhoneSchema,
  city: z.enum(MOROCCAN_CITIES, {
    message: "Ville requise",
  }),
  address: z
    .string()
    .min(10, "Adresse trop courte (minimum 10 caractères)")
    .max(500, "Adresse trop longue"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

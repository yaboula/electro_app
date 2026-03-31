import { z } from "zod";

export const moroccanPhoneSchema = z
  .string()
  .regex(
    /^(?:\+212|0)([ \-]?)(?:5|6|7)\d{8}$/,
    "Numéro de téléphone marocain invalide"
  );

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  phone: moroccanPhoneSchema,
  city: z.string().min(2, "Ville requise"),
  address: z.string().min(10, "Adresse trop courte"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

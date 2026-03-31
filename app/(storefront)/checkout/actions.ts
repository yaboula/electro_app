"use server";

import { headers } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { checkoutSchema } from "@/lib/validations";
import { normalizePhone } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { checkoutRateLimit } from "@/lib/rate-limit";

type CheckoutResult =
  | { success: true; whatsappUrl: string; orderId: string }
  | { success: false; error: string };

export async function createOrderAction(
  inventoryItemId: string,
  _prev: CheckoutResult | null,
  formData: FormData
): Promise<CheckoutResult> {
  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    address: formData.get("address"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const supabase = createServiceRoleClient();
  const normalizedPhone = normalizePhone(parsed.data.phone);

  if (checkoutRateLimit) {
    const headersList = await headers();
    const ip =
      headersList.get("x-real-ip") ??
      headersList.get("x-forwarded-for") ??
      "unknown";
    const identifier = `${ip}:${normalizedPhone}`;

    const { success: allowed } = await checkoutRateLimit.limit(identifier);
    if (!allowed) {
      return {
        success: false,
        error: "Trop de commandes. Veuillez réessayer dans une heure.",
      };
    }
  }

  const { data, error } = await supabase.rpc("create_order_atomic", {
    p_inventory_item_id: inventoryItemId,
    p_quantity: 1,
    p_full_name: parsed.data.fullName,
    p_phone: normalizedPhone,
    p_city: parsed.data.city,
    p_address: parsed.data.address,
  });

  if (error) {
    return {
      success: false,
      error: "Erreur serveur. Veuillez réessayer.",
    };
  }

  const result = data as {
    success: boolean;
    order_id?: string;
    product_title?: string;
    condition?: string;
    total?: number;
    error?: string;
  };

  if (!result.success) {
    return {
      success: false,
      error: result.error ?? "Stock insuffisant pour cet article.",
    };
  }

  const whatsappUrl = buildWhatsAppUrl({
    id: result.order_id!,
    customerName: parsed.data.fullName,
    phone: normalizedPhone,
    city: parsed.data.city,
    items: [
      {
        name: result.product_title!,
        condition: result.condition!,
        price: result.total!,
      },
    ],
    total: result.total!,
  });

  return {
    success: true,
    whatsappUrl,
    orderId: result.order_id!,
  };
}

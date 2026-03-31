"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDIENTE: ["CONFIRMADO", "RTO"],
  CONFIRMADO: ["ENVIADO", "RTO"],
  ENVIADO: ["ENTREGADO", "RTO"],
  ENTREGADO: [],
  RTO: [],
};

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
) {
  const supabase = await createClient();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, customer_id")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { error: "Commande introuvable" };
  }

  const currentStatus = order.status as OrderStatus;
  const allowed = VALID_TRANSITIONS[currentStatus] ?? [];

  if (!allowed.includes(newStatus)) {
    return {
      error: `Transition non autorisée: ${currentStatus} → ${newStatus}`,
    };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (updateError) {
    return { error: "Erreur lors de la mise à jour" };
  }

  // Side effects
  if (newStatus === "ENTREGADO") {
    const { data: customer } = await supabase
      .from("customers")
      .select("successful_deliveries")
      .eq("id", order.customer_id)
      .single();

    if (customer) {
      await supabase
        .from("customers")
        .update({
          successful_deliveries: customer.successful_deliveries + 1,
        })
        .eq("id", order.customer_id);
    }
  }

  if (newStatus === "RTO") {
    // Increment failed deliveries
    const { data: customer } = await supabase
      .from("customers")
      .select("failed_deliveries")
      .eq("id", order.customer_id)
      .single();

    if (customer) {
      await supabase
        .from("customers")
        .update({ failed_deliveries: customer.failed_deliveries + 1 })
        .eq("id", order.customer_id);
    }

    // Restore stock for non-delivered orders
    if (currentStatus !== "ENVIADO" || newStatus === "RTO") {
      await restoreStock(supabase, orderId);
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/dashboard");
}

async function restoreStock(supabase: Awaited<ReturnType<typeof createClient>>, orderId: string) {
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("inventory_item_id, quantity")
    .eq("order_id", orderId);

  if (!orderItems) return;

  for (const oi of orderItems) {
    const { data: item } = await supabase
      .from("inventory_items")
      .select("stock_quantity, condition")
      .eq("id", oi.inventory_item_id)
      .single();

    if (!item) continue;

    const updates: Record<string, unknown> = {
      stock_quantity: item.stock_quantity + oi.quantity,
    };

    if (item.condition !== "NUEVO") {
      updates.is_active = true;
    }

    await supabase
      .from("inventory_items")
      .update(updates)
      .eq("id", oi.inventory_item_id);
  }
}

export async function updateDispatchNotesAction(
  orderId: string,
  notes: string
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("orders")
    .update({ dispatch_notes: notes })
    .eq("id", orderId);

  if (error) {
    return { error: "Erreur lors de la sauvegarde" };
  }

  revalidatePath(`/admin/orders/${orderId}`);
}

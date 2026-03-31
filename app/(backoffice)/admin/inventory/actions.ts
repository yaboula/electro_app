"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { inventoryItemSchema } from "@/lib/validations";

function parseFormData(formData: FormData) {
  const condition = formData.get("condition") as string;
  return {
    product_id: formData.get("product_id") as string,
    condition,
    serial_number: (formData.get("serial_number") as string) || undefined,
    grade_notes: (formData.get("grade_notes") as string) || undefined,
    stock_quantity:
      condition !== "NUEVO" ? 1 : Number(formData.get("stock_quantity")),
    price: Number(formData.get("price")),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createInventoryAction(
  _prev: { error: string } | null,
  formData: FormData
) {
  const raw = parseFormData(formData);
  const parsed = inventoryItemSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const extraImages = (formData.get("extra_images") as string) || null;
  const supabase = await createClient();

  const { error } = await supabase.from("inventory_items").insert({
    product_id: parsed.data.product_id,
    condition: parsed.data.condition,
    serial_number: parsed.data.serial_number ?? null,
    grade_notes: parsed.data.grade_notes ?? null,
    stock_quantity: parsed.data.stock_quantity,
    price: parsed.data.price,
    is_active: parsed.data.is_active,
    extra_images: extraImages ? JSON.parse(extraImages) : [],
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ce numéro de série existe déjà." };
    }
    return { error: "Erreur lors de la création de l'article" };
  }

  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

export async function updateInventoryAction(
  id: string,
  _prev: { error: string } | null,
  formData: FormData
) {
  const raw = parseFormData(formData);
  const parsed = inventoryItemSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const extraImages = (formData.get("extra_images") as string) || null;
  const supabase = await createClient();

  const { error } = await supabase
    .from("inventory_items")
    .update({
      product_id: parsed.data.product_id,
      condition: parsed.data.condition,
      serial_number: parsed.data.serial_number ?? null,
      grade_notes: parsed.data.grade_notes ?? null,
      stock_quantity: parsed.data.stock_quantity,
      price: parsed.data.price,
      is_active: parsed.data.is_active,
      extra_images: extraImages ? JSON.parse(extraImages) : [],
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Ce numéro de série existe déjà." };
    }
    return { error: "Erreur lors de la mise à jour" };
  }

  revalidatePath("/admin/inventory");
  redirect("/admin/inventory");
}

export async function deleteInventoryAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("inventory_items")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: "Erreur lors de la suppression" };
  }

  revalidatePath("/admin/inventory");
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { productSchema } from "@/lib/validations";

function parseFormData(formData: FormData) {
  return {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    platform: formData.get("platform") as string,
    type: formData.get("type") as string,
    base_description: formData.get("base_description") as string,
    is_published: formData.get("is_published") === "on",
  };
}

export async function createProductAction(
  _prev: { error: string } | null,
  formData: FormData
) {
  const raw = parseFormData(formData);
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const imageUrl = (formData.get("main_image_url") as string) || null;
  const supabase = await createClient();

  const { error } = await supabase.from("products").insert({
    ...parsed.data,
    main_image_url: imageUrl,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ce slug existe déjà. Choisissez un autre slug." };
    }
    return { error: "Erreur lors de la création du produit" };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(
  id: string,
  _prev: { error: string } | null,
  formData: FormData
) {
  const raw = parseFormData(formData);
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const imageUrl = (formData.get("main_image_url") as string) || null;
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .update({ ...parsed.data, main_image_url: imageUrl })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Ce slug existe déjà." };
    }
    return { error: "Erreur lors de la mise à jour" };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return { error: "Erreur lors de la suppression" };
  }

  revalidatePath("/admin/products");
}

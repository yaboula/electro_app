import { createClient } from "@/lib/supabase/server";

export async function getPublishedProducts(filters?: {
  platform?: string;
  sort?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, inventory_items(id, price, condition, is_active, stock_quantity)")
    .eq("is_published", true);

  if (filters?.platform) {
    query = query.eq("platform", filters.platform);
  }

  const { data: products } = await query.order("created_at", {
    ascending: false,
  });

  const enriched = (products ?? [])
    .map((p) => {
      const items = (p.inventory_items ?? []).filter(
        (i: { is_active: boolean; stock_quantity: number }) =>
          i.is_active && i.stock_quantity > 0
      );
      return {
        ...p,
        inventory_items: undefined,
        min_price: items.length
          ? Math.min(...items.map((i: { price: number }) => i.price))
          : 0,
        has_used: items.some(
          (i: { condition: string }) => i.condition !== "NUEVO"
        ),
        active_items_count: items.length,
      };
    })
    .filter((p) => p.active_items_count > 0);

  if (filters?.sort === "price_asc") {
    enriched.sort((a, b) => a.min_price - b.min_price);
  } else if (filters?.sort === "price_desc") {
    enriched.sort((a, b) => b.min_price - a.min_price);
  }

  return enriched;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "*, inventory_items(id, condition, serial_number, grade_notes, stock_quantity, price, extra_images, is_active)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!product) return null;

  const activeItems = (product.inventory_items ?? []).filter(
    (i: { is_active: boolean; stock_quantity: number }) =>
      i.is_active && i.stock_quantity > 0
  );

  return { ...product, inventory_items: activeItems };
}

export async function getUsedItems(filters?: {
  grade?: string;
  platform?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("inventory_items")
    .select("*, product:products(id, title, slug, platform, main_image_url)")
    .neq("condition", "NUEVO")
    .eq("is_active", true)
    .gt("stock_quantity", 0);

  if (filters?.grade === "A") {
    query = query.eq("condition", "USADO_A");
  } else if (filters?.grade === "B") {
    query = query.eq("condition", "USADO_B");
  }

  const { data: items } = await query.order("created_at", {
    ascending: false,
  });

  let result = (items ?? []).filter(
    (i) => (i.product as { id: string } | null)?.id
  );

  if (filters?.platform) {
    result = result.filter(
      (i) =>
        (i.product as { platform: string } | null)?.platform ===
        filters.platform
    );
  }

  return result;
}

export async function getInventoryItemBySerial(serial: string) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("inventory_items")
    .select("*, product:products(id, title, slug, platform, main_image_url, base_description)")
    .eq("serial_number", serial)
    .eq("is_active", true)
    .single();

  return item;
}

export async function searchProducts(query: string) {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, inventory_items(id, price, condition, is_active, stock_quantity)")
    .eq("is_published", true)
    .or(`title.ilike.%${query}%,platform.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  return (products ?? [])
    .map((p) => {
      const items = (p.inventory_items ?? []).filter(
        (i: { is_active: boolean; stock_quantity: number }) =>
          i.is_active && i.stock_quantity > 0
      );
      return {
        ...p,
        inventory_items: undefined,
        min_price: items.length
          ? Math.min(...items.map((i: { price: number }) => i.price))
          : 0,
        has_used: items.some(
          (i: { condition: string }) => i.condition !== "NUEVO"
        ),
        active_items_count: items.length,
      };
    })
    .filter((p) => p.active_items_count > 0);
}

import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")
    .eq("is_published", true);

  const { data: items } = await supabase
    .from("inventory_items")
    .select("serial_number, updated_at")
    .neq("condition", "NUEVO")
    .eq("is_active", true);

  return [
    {
      url: "https://electro.ma",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://electro.ma/p",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://electro.ma/item",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...(products ?? []).map((p) => ({
      url: `https://electro.ma/p/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...(items ?? [])
      .filter((i) => i.serial_number)
      .map((i) => ({
        url: `https://electro.ma/item/${i.serial_number}`,
        lastModified: new Date(i.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  ];
}

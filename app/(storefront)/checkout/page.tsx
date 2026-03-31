import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutForm } from "@/components/store/checkout-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finaliser la Commande",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ item?: string }>;
}) {
  const { item: itemId } = await searchParams;

  if (!itemId) redirect("/p");

  const supabase = await createClient();

  const { data: item } = await supabase
    .from("inventory_items")
    .select("id, condition, price, stock_quantity, product:products(title, main_image_url, platform)")
    .eq("id", itemId)
    .eq("is_active", true)
    .single();

  if (!item || item.stock_quantity < 1) redirect("/p");

  const product = item.product as {
    title: string;
    main_image_url: string | null;
    platform: string;
  };

  return (
    <div className="px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl">
        <CheckoutForm
          item={{
            id: item.id,
            condition: item.condition,
            price: item.price,
            product,
          }}
        />
      </div>
    </div>
  );
}

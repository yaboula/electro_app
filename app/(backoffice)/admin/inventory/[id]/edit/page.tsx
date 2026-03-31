import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { InventoryForm } from "@/components/admin/inventory-form";
import { updateInventoryAction } from "../../actions";

export default async function EditInventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("id", id)
    .single();

  if (!item) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id, title, platform")
    .order("title");

  const boundAction = updateInventoryAction.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modifier l'Article"
        description={`Réf: ${item.serial_number ?? item.id.slice(0, 8)}`}
        backHref="/admin/inventory"
      />
      <InventoryForm
        item={item}
        products={products ?? []}
        action={boundAction}
      />
    </div>
  );
}

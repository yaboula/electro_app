import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { InventoryForm } from "@/components/admin/inventory-form";
import { createInventoryAction } from "../actions";

export default async function NewInventoryPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, title, platform")
    .order("title");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nouvel Article"
        description="Ajouter un article à l'inventaire"
        backHref="/admin/inventory"
      />
      <InventoryForm
        products={products ?? []}
        action={createInventoryAction}
      />
    </div>
  );
}

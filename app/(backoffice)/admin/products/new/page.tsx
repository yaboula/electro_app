import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "../actions";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Nouveau Produit"
        description="Créer une nouvelle fiche produit"
        backHref="/admin/products"
      />
      <ProductForm action={createProductAction} />
    </div>
  );
}

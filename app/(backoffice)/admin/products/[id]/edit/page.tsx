import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const boundAction = updateProductAction.bind(null, id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modifier le Produit"
        description={product.title}
        backHref="/admin/products"
      />
      <ProductForm product={product} action={boundAction} />
    </div>
  );
}

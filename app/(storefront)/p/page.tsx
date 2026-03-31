import { Suspense } from "react";
import { getPublishedProducts } from "@/lib/queries";
import { ProductCard } from "@/components/store/product-card";
import { PlatformFilter } from "@/components/store/platform-filter";
import { Package } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tous les Produits — ELECTRO.ma",
  description:
    "Consoles, jeux et accessoires gaming neufs et d'occasion au Maroc. Livraison partout, paiement à la livraison.",
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ platform?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const products = await getPublishedProducts({
    platform: params.platform,
    sort: params.sort,
  });

  return (
    <div className="px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Tous les Produits
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} produit{products.length !== 1 ? "s" : ""}{" "}
            disponible{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Suspense fallback={null}>
          <PlatformFilter />
        </Suspense>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-12 w-12 text-muted-foreground/20" />
            <p className="mt-4 text-muted-foreground">
              Aucun produit trouvé pour ces filtres.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

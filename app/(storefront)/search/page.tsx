import { Suspense } from "react";
import { searchProducts } from "@/lib/queries";
import { ProductCard } from "@/components/store/product-card";
import { SearchInput } from "@/components/store/search-input";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recherche",
  description: "Rechercher dans notre catalogue gaming au Maroc.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <Suspense fallback={null}>
          <SearchInput />
        </Suspense>

        {query ? (
          <>
            <p className="text-sm text-muted-foreground">
              {results.length} résultat{results.length !== 1 ? "s" : ""} pour «{" "}
              <span className="font-medium text-foreground">{query}</span> »
            </p>

            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/20" />
                <p className="mt-4 text-muted-foreground">
                  Aucun résultat pour «&nbsp;{query}&nbsp;»
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Essayez avec d&apos;autres mots-clés
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-muted-foreground/20" />
            <p className="mt-4 text-muted-foreground">
              Tapez un mot-clé pour rechercher
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

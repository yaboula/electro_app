import { Suspense } from "react";
import { getUsedItems } from "@/lib/queries";
import { UsedItemCard } from "@/components/store/used-item-card";
import { GradeFilter } from "@/components/store/grade-filter";
import { Gamepad2, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Articles d'Occasion — ELECTRO.ma",
  description:
    "Consoles et jeux d'occasion testés et vérifiés. Grade A et B disponibles avec paiement à la livraison.",
};

export default async function UsedItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ grade?: string; platform?: string }>;
}) {
  const params = await searchParams;
  const items = await getUsedItems({
    grade: params.grade,
    platform: params.platform,
  });

  return (
    <div className="px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Articles d&apos;Occasion
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Produits testés et vérifiés — {items.length} article
            {items.length !== 1 ? "s" : ""} disponible
            {items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Grade explanation */}
        <Card className="border-white/5 bg-card/30">
          <CardContent className="flex items-start gap-3 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-amber-400">Grade A</span> —
              Excellent état, traces d&apos;utilisation minimes.{" "}
              <span className="font-semibold text-orange-400">Grade B</span> —
              Bon état, signes d&apos;usure visibles mais 100% fonctionnel.
            </div>
          </CardContent>
        </Card>

        <Suspense fallback={null}>
          <GradeFilter />
        </Suspense>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Gamepad2 className="h-12 w-12 text-muted-foreground/20" />
            <p className="mt-4 text-muted-foreground">
              Aucun article d&apos;occasion trouvé pour ces filtres.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {items.map((item) => (
              <UsedItemCard
                key={item.id}
                item={{
                  ...item,
                  product: item.product as {
                    title: string;
                    platform: string;
                    main_image_url: string | null;
                  } | null,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

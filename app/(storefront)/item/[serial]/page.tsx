import { notFound } from "next/navigation";
import Link from "next/link";
import { getInventoryItemBySerial } from "@/lib/queries";
import { ProductGallery } from "@/components/store/product-gallery";
import { StickyCTA } from "@/components/store/sticky-cta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Info, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMAD, cn } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ serial: string }>;
}

const gradeInfo: Record<
  string,
  { label: string; badgeClass: string; description: string }
> = {
  USADO_A: {
    label: "Occasion — Grade A",
    badgeClass: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    description:
      "Excellent état, traces d'utilisation minimes. Testé et 100% fonctionnel.",
  },
  USADO_B: {
    label: "Occasion — Grade B",
    badgeClass: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    description:
      "Bon état, signes d'usure visibles mais 100% fonctionnel. Testé et vérifié.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serial } = await params;
  const item = await getInventoryItemBySerial(decodeURIComponent(serial));
  if (!item) return { title: "Article non trouvé — ELECTRO.ma" };

  const product = item.product as { title: string } | null;
  const grade = gradeInfo[item.condition];

  return {
    title: `${product?.title ?? "Article"} ${grade?.label ?? ""} — ELECTRO.ma`,
    description: `${product?.title ?? "Article"} d'occasion disponible à ${formatMAD(item.price)}. ${grade?.description ?? ""}`,
  };
}

export default async function UsedItemDetailPage({ params }: Props) {
  const { serial } = await params;
  const item = await getInventoryItemBySerial(decodeURIComponent(serial));

  if (!item) notFound();

  const product = item.product as {
    title: string;
    slug: string;
    platform: string;
    main_image_url: string | null;
    base_description: string;
  } | null;

  const grade = gradeInfo[item.condition];
  const extraImages = (item.extra_images as string[]) ?? [];

  return (
    <div className="px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Back link */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-1 text-muted-foreground"
          render={<Link href="/item" />}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux occasions
        </Button>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery */}
          <ProductGallery
            mainImage={product?.main_image_url ?? null}
            title={product?.title ?? "Article"}
            extraImages={extraImages}
          />

          {/* Item info */}
          <div className="space-y-5">
            <div>
              {grade && (
                <Badge
                  variant="outline"
                  className={cn("text-xs", grade.badgeClass)}
                >
                  {grade.label}
                </Badge>
              )}
              <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                {product?.title ?? "Article"}
              </h1>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Réf: {item.serial_number}
              </p>
            </div>

            <p className="text-3xl font-bold text-primary">
              {formatMAD(item.price)}
            </p>

            <Separator className="bg-white/5" />

            {item.grade_notes && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Notes de condition
                </p>
                <p className="mt-1 text-sm leading-relaxed">
                  {item.grade_notes}
                </p>
              </div>
            )}

            {product?.base_description && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  À propos du produit
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {product.base_description}
                </p>
              </div>
            )}

            {/* Grade info card */}
            {grade && (
              <Card className="border-white/5 bg-card/30">
                <CardContent className="flex items-start gap-3 p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {grade.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <StickyCTA
              itemId={item.id}
              price={item.price}
              label="Commander cet article"
            />
          </div>
        </div>
      </div>

      <div className="h-20 md:hidden" />
    </div>
  );
}

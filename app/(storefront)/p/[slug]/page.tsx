import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/queries";
import { ProductGallery } from "@/components/store/product-gallery";
import { InventoryOptions } from "@/components/store/inventory-options";
import { PlatformBadge } from "@/components/admin/status-badge";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Produit non trouvé — ELECTRO.ma" };

  return {
    title: `${product.title} — ELECTRO.ma`,
    description: product.base_description,
    openGraph: {
      images: product.main_image_url ? [product.main_image_url] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const items = product.inventory_items as {
    id: string;
    condition: string;
    serial_number: string | null;
    price: number;
    stock_quantity: number;
    extra_images: string[];
  }[];

  return (
    <div className="px-4 py-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Gallery */}
          <ProductGallery
            mainImage={product.main_image_url}
            title={product.title}
          />

          {/* Product info */}
          <div className="space-y-5">
            <div>
              <PlatformBadge platform={product.platform} />
              <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
                {product.title}
              </h1>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.base_description}
            </p>

            <Separator className="bg-white/5" />

            {items.length > 0 ? (
              <InventoryOptions items={items} />
            ) : (
              <div className="rounded-xl border border-white/5 bg-card/30 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Ce produit est actuellement en rupture de stock.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extra bottom padding for mobile sticky CTA */}
      <div className="h-20 md:hidden" />
    </div>
  );
}

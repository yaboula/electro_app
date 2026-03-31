import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatMAD } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { PlatformBadge, PublishBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Package } from "lucide-react";
import { DeleteProductButton } from "./delete-button";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, inventory_items(id, is_active, price)")
    .order("created_at", { ascending: false });

  const enriched = (products ?? []).map((p) => {
    const items = p.inventory_items ?? [];
    const activeItems = items.filter((i: { is_active: boolean }) => i.is_active);
    return {
      ...p,
      active_items_count: activeItems.length,
      min_price: activeItems.length
        ? Math.min(...activeItems.map((i: { price: number }) => i.price))
        : 0,
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des Produits"
        description={`${enriched.length} produit(s) au total`}
        actionLabel="Nouveau Produit"
        actionHref="/admin/products/new"
      />

      {enriched.length === 0 ? (
        <Card className="border-white/5 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              Aucun produit pour le moment.
            </p>
            <Button className="mt-4" render={<Link href="/admin/products/new" />}>
              Créer le premier produit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-white/5 bg-card/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead className="w-14"></TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Plateforme</TableHead>
                <TableHead className="text-center">Items</TableHead>
                <TableHead>Prix min.</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enriched.map((product) => (
                <TableRow key={product.id} className="border-white/5">
                  <TableCell>
                    {product.main_image_url ? (
                      <Image
                        src={product.main_image_url}
                        alt={product.title}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>
                    <PlatformBadge platform={product.platform} />
                  </TableCell>
                  <TableCell className="text-center">
                    {product.active_items_count}
                  </TableCell>
                  <TableCell>
                    {product.min_price > 0
                      ? formatMAD(product.min_price)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <PublishBadge isPublished={product.is_published} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={<Link href={`/admin/products/${product.id}/edit`} />}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Éditer</span>
                      </Button>
                      <DeleteProductButton
                        id={product.id}
                        title={product.title}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

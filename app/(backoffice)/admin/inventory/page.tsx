import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMAD } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import {
  ConditionBadge,
  ActiveBadge,
} from "@/components/admin/status-badge";
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
import { Pencil, BoxesIcon } from "lucide-react";
import { DeleteInventoryButton } from "./delete-button";

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data: items } = await supabase
    .from("inventory_items")
    .select("*, product:products(title, platform)")
    .order("created_at", { ascending: false });

  const inventory = items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion de l'Inventaire"
        description={`${inventory.length} article(s) au total`}
        actionLabel="Nouvel Article"
        actionHref="/admin/inventory/new"
      />

      {inventory.length === 0 ? (
        <Card className="border-white/5 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <BoxesIcon className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              Aucun article en inventaire.
            </p>
            <Button
              className="mt-4"
              render={<Link href="/admin/inventory/new" />}
            >
              Ajouter le premier article
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-white/5 bg-card/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead>Produit</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>N° Série</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id} className="border-white/5">
                  <TableCell className="font-medium">
                    {(item.product as { title: string } | null)?.title ?? "—"}
                  </TableCell>
                  <TableCell>
                    <ConditionBadge condition={item.condition} />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {item.serial_number ?? "—"}
                  </TableCell>
                  <TableCell>{formatMAD(item.price)}</TableCell>
                  <TableCell className="text-center">
                    {item.stock_quantity}
                  </TableCell>
                  <TableCell>
                    <ActiveBadge isActive={item.is_active} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        render={
                          <Link href={`/admin/inventory/${item.id}/edit`} />
                        }
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span className="sr-only">Éditer</span>
                      </Button>
                      <DeleteInventoryButton id={item.id} />
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

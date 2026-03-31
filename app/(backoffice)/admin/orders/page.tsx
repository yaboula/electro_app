import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMAD, timeAgo } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { WhatsAppLink } from "@/components/admin/whatsapp-link";
import { OrderActions } from "@/components/admin/order-actions";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardList } from "lucide-react";
import { StatusTabs } from "./status-tabs";
import { Suspense } from "react";

const STATUS_LIST = ["", "PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "RTO"] as const;

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: filterStatus } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("orders")
    .select(
      "*, customer:customers(full_name, phone), order_items(id, quantity, unit_price_at_purchase, inventory_item:inventory_items(condition, product:products(title)))"
    )
    .order("created_at", { ascending: false });

  if (filterStatus && STATUS_LIST.includes(filterStatus as (typeof STATUS_LIST)[number])) {
    query = query.eq("status", filterStatus as "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "RTO");
  }

  const { data: orders } = await query;

  // Count by status for tabs
  const { data: allOrders } = await supabase
    .from("orders")
    .select("status");

  const counts: Record<string, number> = {};
  (allOrders ?? []).forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });
  const totalCount = allOrders?.length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des Commandes"
        description={`${totalCount} commande(s) au total`}
      />

      <Suspense fallback={null}>
        <StatusTabs counts={counts} total={totalCount} />
      </Suspense>

      {(orders ?? []).length === 0 ? (
        <Card className="border-white/5 bg-card/50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <ClipboardList className="h-10 w-10 text-muted-foreground/30" />
            <p className="mt-4 text-sm text-muted-foreground">
              Aucune commande trouvée.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-white/5 bg-card/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5">
                <TableHead># Commande</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Ville</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(orders ?? []).map((order) => {
                const customer = order.customer as {
                  full_name: string;
                  phone: string;
                } | null;

                return (
                  <TableRow key={order.id} className="border-white/5">
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-mono text-xs font-semibold text-primary hover:underline"
                      >
                        #{order.id.slice(0, 8).toUpperCase()}
                      </Link>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {timeAgo(order.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {customer?.full_name ?? "—"}
                      </div>
                      {customer?.phone && (
                        <WhatsAppLink
                          phone={customer.phone}
                          orderId={order.id}
                        >
                          <span className="text-xs">
                            {customer.phone}
                          </span>
                        </WhatsAppLink>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{order.city}</TableCell>
                    <TableCell className="font-semibold">
                      {formatMAD(order.total_amount)}
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderActions
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

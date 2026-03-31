import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatMAD, timeAgo } from "@/lib/utils";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderActions } from "@/components/admin/order-actions";
import { WhatsAppLink } from "@/components/admin/whatsapp-link";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  MapPin,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { DispatchNotes } from "./dispatch-notes";
import { OrderTimeline } from "./timeline";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select(
      "*, customer:customers(id, full_name, phone, default_city, successful_deliveries, failed_deliveries), order_items(id, quantity, unit_price_at_purchase, inventory_item:inventory_items(id, condition, serial_number, product:products(title, platform)))"
    )
    .eq("id", id)
    .single();

  if (!order) notFound();

  const customer = order.customer as {
    id: string;
    full_name: string;
    phone: string;
    default_city: string | null;
    successful_deliveries: number;
    failed_deliveries: number;
  } | null;

  const items = (order.order_items ?? []) as {
    id: string;
    quantity: number;
    unit_price_at_purchase: number;
    inventory_item: {
      id: string;
      condition: string;
      serial_number: string | null;
      product: { title: string; platform: string } | null;
    } | null;
  }[];

  const conditionLabels: Record<string, string> = {
    NUEVO: "Neuf",
    USADO_A: "Grade A",
    USADO_B: "Grade B",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Commande #${order.id.slice(0, 8).toUpperCase()}`}
        description={`Créée ${timeAgo(order.created_at)}`}
        backHref="/admin/orders"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Customer info */}
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-sm font-semibold">
                Informations Client
              </h2>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{customer?.full_name ?? "—"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                  {customer?.phone ? (
                    <WhatsAppLink phone={customer.phone} orderId={order.id} />
                  ) : (
                    "—"
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>
                    {order.city} — {order.address}
                  </span>
                </div>
              </div>

              {customer && (
                <>
                  <Separator className="bg-white/5" />
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>
                        {customer.successful_deliveries} livraison
                        {customer.successful_deliveries !== 1 ? "s" : ""}{" "}
                        réussie
                        {customer.successful_deliveries !== 1 ? "s" : ""}
                      </span>
                    </div>
                    {customer.failed_deliveries > 0 && (
                      <div className="flex items-center gap-1 text-red-400">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>
                          {customer.failed_deliveries} échec
                          {customer.failed_deliveries !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order items */}
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-sm font-semibold">
                Articles Commandés
              </h2>
              <div className="space-y-3">
                {items.map((oi) => (
                  <div
                    key={oi.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-card/30 p-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {oi.inventory_item?.product?.title ?? "Article"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge
                          variant="outline"
                          className="text-[10px]"
                        >
                          {conditionLabels[oi.inventory_item?.condition ?? ""] ??
                            oi.inventory_item?.condition}
                        </Badge>
                        {oi.inventory_item?.serial_number && (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            #{oi.inventory_item.serial_number}
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          × {oi.quantity}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold shrink-0">
                      {formatMAD(oi.unit_price_at_purchase * oi.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="bg-white/5" />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">
                  {formatMAD(order.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status + actions */}
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold">Statut</h2>
                <OrderStatusBadge status={order.status} size="lg" />
              </div>

              <OrderTimeline
                status={order.status}
                createdAt={order.created_at}
              />

              <OrderActions
                orderId={order.id}
                currentStatus={order.status}
                size="default"
              />
            </CardContent>
          </Card>

          {/* Dispatch notes */}
          <DispatchNotes
            orderId={order.id}
            initialNotes={order.dispatch_notes ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatMAD, timeAgo } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Truck,
  ArrowRight,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardMetrics } from "./metrics";

async function getDashboardData() {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [
    { count: ordersToday },
    { data: monthlyRevenue },
    { count: activeItems },
    { data: deliveryStats },
    { data: recentOrders },
    { data: pendingOld },
    { data: lowStock },
  ] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),
    supabase
      .from("orders")
      .select("total_amount")
      .eq("status", "ENTREGADO")
      .gte("created_at", monthStart.toISOString()),
    supabase
      .from("inventory_items")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)
      .gt("stock_quantity", 0),
    supabase
      .from("orders")
      .select("status")
      .in("status", ["ENTREGADO", "RTO"])
      .gte("created_at", monthStart.toISOString()),
    supabase
      .from("orders")
      .select(
        "id, total_amount, status, created_at, customer:customers(full_name)"
      )
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("orders")
      .select("id")
      .eq("status", "PENDIENTE")
      .lt(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      ),
    supabase
      .from("inventory_items")
      .select("id, product:products(title)")
      .eq("is_active", true)
      .eq("stock_quantity", 1),
  ]);

  const revenue = (monthlyRevenue ?? []).reduce(
    (sum, o) => sum + o.total_amount,
    0
  );

  const delivered = (deliveryStats ?? []).filter(
    (o) => o.status === "ENTREGADO"
  ).length;
  const rto = (deliveryStats ?? []).filter((o) => o.status === "RTO").length;
  const deliveryRate =
    delivered + rto > 0
      ? Math.round((delivered / (delivered + rto)) * 100)
      : 0;

  return {
    ordersToday: ordersToday ?? 0,
    revenue,
    activeItems: activeItems ?? 0,
    deliveryRate,
    recentOrders: recentOrders ?? [],
    pendingOldCount: pendingOld?.length ?? 0,
    lowStockItems: lowStock ?? [],
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  const metrics = [
    {
      label: "Commandes Aujourd'hui",
      value: String(data.ordersToday),
      icon: ShoppingBag,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Revenus du Mois",
      value: formatMAD(data.revenue),
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Produits en Stock",
      value: String(data.activeItems),
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Taux de Livraison",
      value: `${data.deliveryRate}%`,
      icon: Truck,
      color:
        data.deliveryRate >= 80
          ? "text-green-500"
          : data.deliveryRate >= 60
            ? "text-amber-500"
            : "text-red-500",
      bg:
        data.deliveryRate >= 80
          ? "bg-green-500/10"
          : data.deliveryRate >= 60
            ? "bg-amber-500/10"
            : "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Tableau de Bord
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      <DashboardMetrics metrics={metrics} />

      {/* Alerts */}
      {(data.pendingOldCount > 0 || data.lowStockItems.length > 0) && (
        <div className="grid gap-4 sm:grid-cols-2">
          {data.pendingOldCount > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardContent className="flex items-start gap-3 p-4">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <div>
                  <p className="text-sm font-medium text-amber-400">
                    {data.pendingOldCount} commande
                    {data.pendingOldCount !== 1 ? "s" : ""} en attente
                    depuis +24h
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Confirmez ou annulez ces commandes rapidement
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {data.lowStockItems.length > 0 && (
            <Card className="border-orange-500/20 bg-orange-500/5">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-orange-400">
                    {data.lowStockItems.length} article
                    {data.lowStockItems.length !== 1 ? "s" : ""} avec
                    stock = 1
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Réapprovisionnez ou marquez comme indisponible
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent orders */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Commandes Récentes</h2>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-muted-foreground"
            render={<Link href="/admin/orders" />}
          >
            Voir tout
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        {data.recentOrders.length === 0 ? (
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-8 text-center text-sm text-muted-foreground">
              Aucune commande pour le moment
            </CardContent>
          </Card>
        ) : (
          <Card className="border-white/5 bg-card/50 overflow-hidden">
            <div className="divide-y divide-white/5">
              {data.recentOrders.map((order) => {
                const customer = order.customer as {
                  full_name: string;
                } | null;
                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-sm font-medium truncate">
                        {customer?.full_name ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-semibold">
                        {formatMAD(order.total_amount)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                      <span className="text-[10px] text-muted-foreground w-16 text-right">
                        {timeAgo(order.created_at)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

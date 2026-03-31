"use client";

import { CheckCircle2, Truck, PackageCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { updateOrderStatusAction } from "@/app/(backoffice)/admin/orders/actions";
import type { OrderStatus } from "@/types";

const transitions: Record<
  string,
  { label: string; status: OrderStatus; icon: React.ElementType; variant: "default" | "destructive" }[]
> = {
  PENDIENTE: [
    { label: "Confirmer", status: "CONFIRMADO", icon: CheckCircle2, variant: "default" },
    { label: "Annuler (RTO)", status: "RTO", icon: XCircle, variant: "destructive" },
  ],
  CONFIRMADO: [
    { label: "Expédier", status: "ENVIADO", icon: Truck, variant: "default" },
    { label: "Annuler (RTO)", status: "RTO", icon: XCircle, variant: "destructive" },
  ],
  ENVIADO: [
    { label: "Livré", status: "ENTREGADO", icon: PackageCheck, variant: "default" },
    { label: "Retour (RTO)", status: "RTO", icon: XCircle, variant: "destructive" },
  ],
};

export function OrderActions({
  orderId,
  currentStatus,
  size = "sm",
}: {
  orderId: string;
  currentStatus: string;
  size?: "sm" | "default";
}) {
  const available = transitions[currentStatus];
  if (!available) return null;

  return (
    <div className="flex items-center gap-1.5">
      {available.map((action) => {
        const Icon = action.icon;
        return (
          <ConfirmDialog
            key={action.status}
            title={`${action.label} cette commande ?`}
            description={
              action.status === "RTO"
                ? "Le stock sera restauré et la livraison comptée comme échouée."
                : `La commande passera à l'état "${action.label}".`
            }
            variant={action.variant}
            trigger={
              <Button
                variant={action.variant === "destructive" ? "destructive" : "outline"}
                size={size === "sm" ? "xs" : "sm"}
                className="gap-1"
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            }
            onConfirm={async () => {
              await updateOrderStatusAction(orderId, action.status);
            }}
          />
        );
      })}
    </div>
  );
}

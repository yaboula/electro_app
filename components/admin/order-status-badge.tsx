import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  Truck,
  PackageCheck,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<
  string,
  { label: string; icon: React.ElementType; className: string }
> = {
  PENDIENTE: {
    label: "En attente",
    icon: Clock,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  CONFIRMADO: {
    label: "Confirmée",
    icon: CheckCircle2,
    className: "border-blue-500/30 bg-blue-500/10 text-blue-400",
  },
  ENVIADO: {
    label: "Expédiée",
    icon: Truck,
    className: "border-purple-500/30 bg-purple-500/10 text-purple-400",
  },
  ENTREGADO: {
    label: "Livrée",
    icon: PackageCheck,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  },
  RTO: {
    label: "Retour",
    icon: XCircle,
    className: "border-red-500/30 bg-red-500/10 text-red-400",
  },
};

export function OrderStatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "lg";
}) {
  const config = statusConfig[status];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        config.className,
        size === "lg" ? "px-3 py-1 text-sm gap-1.5" : "text-xs gap-1"
      )}
    >
      <Icon className={size === "lg" ? "h-4 w-4" : "h-3 w-3"} />
      {config.label}
    </Badge>
  );
}

export { statusConfig };

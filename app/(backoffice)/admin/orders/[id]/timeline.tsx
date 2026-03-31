import {
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "PENDIENTE", label: "Commande créée", icon: Clock },
  { key: "CONFIRMADO", label: "Confirmée", icon: CheckCircle2 },
  { key: "ENVIADO", label: "Expédiée", icon: Truck },
  { key: "ENTREGADO", label: "Livrée", icon: PackageCheck },
];

const STATUS_ORDER: Record<string, number> = {
  PENDIENTE: 0,
  CONFIRMADO: 1,
  ENVIADO: 2,
  ENTREGADO: 3,
  RTO: -1,
};

export function OrderTimeline({
  status,
  createdAt,
}: {
  status: string;
  createdAt: string;
}) {
  const currentIndex = STATUS_ORDER[status] ?? -1;
  const isRTO = status === "RTO";

  return (
    <div className="space-y-0">
      {STEPS.map((step, i) => {
        const isCompleted = !isRTO && currentIndex >= i;
        const isCurrent = !isRTO && currentIndex === i;
        const Icon = step.icon;

        return (
          <div key={step.key} className="flex gap-3">
            {/* Vertical line + icon */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted
                    ? "border-primary bg-primary/10"
                    : "border-white/10 bg-card/30"
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    isCompleted
                      ? "text-primary"
                      : "text-muted-foreground/40"
                  )}
                />
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "w-0.5 flex-1 min-h-6",
                    isCompleted && currentIndex > i
                      ? "bg-primary/30"
                      : "bg-white/5"
                  )}
                />
              )}
            </div>

            {/* Label */}
            <div className="pb-5">
              <p
                className={cn(
                  "text-xs font-medium",
                  isCompleted
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                )}
              >
                {step.label}
              </p>
              {i === 0 && (
                <p className="text-[10px] text-muted-foreground">
                  {new Intl.DateTimeFormat("fr-MA", {
                    dateStyle: "long",
                    timeStyle: "short",
                  }).format(new Date(createdAt))}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {isRTO && (
        <div className="flex gap-3 items-center">
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-red-500/30 bg-red-500/10">
            <span className="text-xs text-red-400">✕</span>
          </div>
          <p className="text-xs font-medium text-red-400">
            Retour (RTO)
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "", label: "Tous" },
  { value: "PENDIENTE", label: "En attente" },
  { value: "CONFIRMADO", label: "Confirmées" },
  { value: "ENVIADO", label: "Expédiées" },
  { value: "ENTREGADO", label: "Livrées" },
  { value: "RTO", label: "Retours" },
];

export function StatusTabs({
  counts,
  total,
}: {
  counts: Record<string, number>;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("status") ?? "";

  function handleTab(value: string) {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    router.push(`${pathname}${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {TABS.map((tab) => {
        const count = tab.value ? (counts[tab.value] ?? 0) : total;
        const isActive = current === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => handleTab(tab.value)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-card/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-white/5"
            )}
          >
            {tab.label}
            <Badge
              variant="secondary"
              className={cn(
                "h-4 min-w-4 px-1 text-[10px]",
                isActive && "bg-primary-foreground/20 text-primary-foreground"
              )}
            >
              {count}
            </Badge>
          </button>
        );
      })}
    </div>
  );
}

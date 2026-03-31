"use client";

import { useState } from "react";
import { cn, formatMAD } from "@/lib/utils";
import { ConditionBadge } from "@/components/admin/status-badge";
import { StickyCTA } from "./sticky-cta";

interface InventoryItem {
  id: string;
  condition: string;
  serial_number: string | null;
  price: number;
  stock_quantity: number;
}

interface InventoryOptionsProps {
  items: InventoryItem[];
}

export function InventoryOptions({ items }: InventoryOptionsProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? "");

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Options disponibles
        </p>
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all",
                isSelected
                  ? "border-primary/50 bg-primary/5"
                  : "border-white/5 bg-card/30 hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected ? "border-primary" : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <ConditionBadge condition={item.condition} />
                  {item.serial_number && (
                    <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                      #{item.serial_number}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatMAD(item.price)}</p>
                <p className="text-[10px] text-muted-foreground">
                  {item.stock_quantity > 1
                    ? `${item.stock_quantity} en stock`
                    : "Dernier article"}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {selectedItem && (
        <StickyCTA
          itemId={selectedItem.id}
          price={selectedItem.price}
        />
      )}
    </>
  );
}

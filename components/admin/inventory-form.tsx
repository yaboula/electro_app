"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CONDITIONS } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import type { InventoryItem, Product } from "@/types";

interface InventoryFormProps {
  item?: InventoryItem;
  products: Pick<Product, "id" | "title" | "platform">[];
  action: (
    prev: { error: string } | null,
    formData: FormData
  ) => Promise<{ error: string } | null>;
}

const conditionLabels: Record<string, string> = {
  NUEVO: "Neuf",
  USADO_A: "Occasion — Grade A",
  USADO_B: "Occasion — Grade B",
};

export function InventoryForm({ item, products, action }: InventoryFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [condition, setCondition] = useState<string>(item?.condition ?? "NUEVO");
  const isUsed = condition !== "NUEVO";

  return (
    <Card className="border-white/5 bg-card/50">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="product_id">Produit</Label>
              <select
                id="product_id"
                name="product_id"
                defaultValue={item?.product_id ?? ""}
                required
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                <option value="" disabled>
                  Choisir un produit...
                </option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.platform})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {conditionLabels[c]}
                  </option>
                ))}
              </select>
            </div>

            {isUsed && (
              <div className="space-y-2">
                <Label htmlFor="serial_number">N° de Série *</Label>
                <Input
                  id="serial_number"
                  name="serial_number"
                  defaultValue={item?.serial_number ?? ""}
                  placeholder="SN-XXXXXXXXXX"
                  required
                />
              </div>
            )}

            {isUsed && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="grade_notes">Notes de grade</Label>
                <Textarea
                  id="grade_notes"
                  name="grade_notes"
                  defaultValue={item?.grade_notes ?? ""}
                  placeholder="Micro-rayures sur la coque, manette incluse..."
                  rows={3}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="price">Prix (MAD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={item?.price ?? ""}
                placeholder="3500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock_quantity">
                Quantité en stock{isUsed ? " (fixé à 1)" : ""}
              </Label>
              <Input
                id="stock_quantity"
                name="stock_quantity"
                type="number"
                min={0}
                step={1}
                defaultValue={isUsed ? 1 : (item?.stock_quantity ?? "")}
                disabled={isUsed}
                required={!isUsed}
              />
              {isUsed && (
                <input type="hidden" name="stock_quantity" value="1" />
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_active"
              name="is_active"
              defaultChecked={item?.is_active ?? true}
            />
            <Label htmlFor="is_active">
              Actif (disponible à la vente)
            </Label>
          </div>

          {state?.error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {item ? "Enregistrer" : "Créer l'article"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

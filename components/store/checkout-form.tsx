"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MOROCCAN_CITIES } from "@/lib/validations";
import { formatMAD } from "@/lib/utils";
import { createOrderAction } from "@/app/(storefront)/checkout/actions";
import { Loader2, MessageCircle, ShieldCheck } from "lucide-react";

interface CheckoutFormProps {
  item: {
    id: string;
    condition: string;
    price: number;
    product: {
      title: string;
      main_image_url: string | null;
      platform: string;
    };
  };
}

const conditionLabels: Record<string, string> = {
  NUEVO: "Neuf",
  USADO_A: "Occasion Grade A",
  USADO_B: "Occasion Grade B",
};

export function CheckoutForm({ item }: CheckoutFormProps) {
  const router = useRouter();
  const boundAction = createOrderAction.bind(null, item.id);
  const [state, formAction, isPending] = useActionState(boundAction, null);

  useEffect(() => {
    if (state?.success) {
      const params = new URLSearchParams({
        order: state.orderId,
        wa: state.whatsappUrl,
      });
      router.push(`/checkout/confirmation?${params.toString()}`);
    }
  }, [state, router]);

  return (
    <div className="grid gap-6 lg:grid-cols-5 lg:gap-10">
      {/* Form column */}
      <div className="lg:col-span-3 space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">
          Finaliser la Commande
        </h1>

        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              name="fullName"
              placeholder="Mohammed Alaoui"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="06 XX XX XX XX"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <select
              id="city"
              name="city"
              required
              className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
            >
              <option value="" disabled selected>
                Choisir votre ville...
              </option>
              {MOROCCAN_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Numéro, rue, quartier, immeuble..."
              rows={3}
              required
            />
          </div>

          {state && !state.success && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          {/* Mobile CTA */}
          <div className="lg:hidden">
            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
              Confirmer — {formatMAD(item.price)}
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              <ShieldCheck className="inline h-3 w-3 mr-0.5" />
              Paiement à la livraison (Cash on Delivery)
            </p>
          </div>
        </form>
      </div>

      {/* Summary column */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-24 space-y-4">
          <Card className="border-white/5 bg-card/50">
            <CardContent className="p-5 space-y-4">
              <h2 className="text-sm font-semibold">Résumé</h2>

              <div className="flex gap-3">
                {item.product.main_image_url ? (
                  <img
                    src={item.product.main_image_url}
                    alt={item.product.title}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-muted text-muted-foreground text-xs">
                    N/A
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.product.platform} ·{" "}
                    {conditionLabels[item.condition] ?? item.condition}
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/5 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{formatMAD(item.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="text-green-400">Gratuite</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatMAD(item.price)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <Button
              type="submit"
              form="checkout-form"
              size="lg"
              disabled={isPending}
              className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
              onClick={() => {
                const form = document.querySelector("form");
                form?.requestSubmit();
              }}
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageCircle className="h-4 w-4" />
              )}
              Confirmer via WhatsApp — {formatMAD(item.price)}
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              <ShieldCheck className="inline h-3 w-3 mr-0.5" />
              Paiement à la livraison (Cash on Delivery)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

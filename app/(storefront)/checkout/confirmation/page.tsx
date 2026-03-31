import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MessageCircle, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ConfirmationAnimation } from "./animation";

export const metadata: Metadata = {
  title: "Commande Confirmée",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; wa?: string }>;
}) {
  const params = await searchParams;
  const orderId = params.order;
  const whatsappUrl = params.wa;

  if (!orderId || !whatsappUrl) redirect("/p");

  return (
    <div className="px-4 py-12 md:px-6 md:py-20">
      <div className="mx-auto max-w-lg">
        <Card className="border-white/5 bg-card/50 overflow-hidden">
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
            <ConfirmationAnimation />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold">
                Commande enregistrée !
              </h1>
              <p className="text-sm text-muted-foreground">
                Votre commande{" "}
                <span className="font-mono font-semibold text-foreground">
                  #{orderId.slice(0, 8).toUpperCase()}
                </span>{" "}
                a été créée avec succès.
              </p>
            </div>

            <Card className="w-full border-white/5 bg-muted/30">
              <CardContent className="p-4 text-left text-sm text-muted-foreground leading-relaxed">
                Un conseiller va vous contacter sur WhatsApp pour confirmer
                votre commande et organiser la livraison. Vous pouvez aussi
                ouvrir WhatsApp maintenant pour accélérer le processus.
              </CardContent>
            </Card>

            <div className="flex w-full flex-col gap-3">
              <Button
                size="lg"
                className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
                render={
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <MessageCircle className="h-4 w-4" />
                Ouvrir WhatsApp
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 border-white/10"
                render={<Link href="/p" />}
              >
                <ArrowLeft className="h-4 w-4" />
                Retour à la boutique
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

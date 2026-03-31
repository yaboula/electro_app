"use client";

import { motion } from "framer-motion";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Truck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const metrics = [
  {
    label: "Commandes Aujourd'hui",
    value: "--",
    icon: ShoppingBag,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Revenus du Mois",
    value: "-- MAD",
    icon: TrendingUp,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Produits en Stock",
    value: "--",
    icon: Package,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Taux de Livraison",
    value: "--%",
    icon: Truck,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tableau de Bord</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble de votre activité
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                    metric.bg
                  )}
                >
                  <metric.icon className={cn("h-5 w-5", metric.color)} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {metric.value}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <Package className="h-10 w-10 text-muted-foreground/30" />
          <p className="mt-4 text-sm text-muted-foreground">
            Les métriques seront connectées aux données réelles dans un prochain sprint.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

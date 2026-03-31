"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

interface Metric {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export function DashboardMetrics({ metrics }: { metrics: Metric[] }) {
  return (
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
  );
}

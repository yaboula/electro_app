"use client";

import { motion } from "framer-motion";
import { Users, Package, Truck, Star } from "lucide-react";

const STATS = [
  { icon: Users,   value: "2 000+", label: "Clients satisfaits", color: "text-indigo-600",  bg: "bg-indigo-50",  shadow: "shadow-indigo-500/15" },
  { icon: Package, value: "5 000+", label: "Commandes livrées",  color: "text-violet-600",  bg: "bg-violet-50",  shadow: "shadow-violet-500/15" },
  { icon: Truck,   value: "24-48h", label: "Délai de livraison", color: "text-sky-600",     bg: "bg-sky-50",     shadow: "shadow-sky-500/15" },
  { icon: Star,    value: "4.9/5",  label: "Note moyenne",       color: "text-amber-600",   bg: "bg-amber-50",   shadow: "shadow-amber-500/15" },
];

export function StatsBar() {
  return (
    <section className="py-10 px-6">
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, value, label, color, bg, shadow }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
            className={`clay-card flex items-center gap-4 px-5 py-5 shadow-xl ${shadow}`}
          >
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <div>
              <p className={`text-2xl font-black ${color}`}>{value}</p>
              <p className="text-xs font-semibold text-slate-500">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

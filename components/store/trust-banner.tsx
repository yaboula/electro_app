"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const PILLARS = [
  {
    icon: Truck,
    title: "Livraison 24–48h",
    desc: "Partout au Maroc, suivie et rapide",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: ShieldCheck,
    title: "Paiement à la livraison",
    desc: "Vous payez uniquement à réception",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    icon: RefreshCw,
    title: "Retour facile 7 jours",
    desc: "Produit défectueux ? On s'en charge",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Headphones,
    title: "Support WhatsApp 7j/7",
    desc: "Réponse garantie en moins de 2h",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-100",
  },
];

export function TrustBanner() {
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="section-card px-6 py-8 md:py-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Pourquoi choisir ELECTRO.ma ?
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              +2 400 clients satisfaits depuis 2022
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.09, duration: 0.4 }}
                  whileHover={{ y: -4 }}
                  className={`flex flex-col items-center gap-3 rounded-2xl border ${p.border} ${p.bg} px-4 py-6 text-center`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${p.bg} border ${p.border} shadow-sm`}>
                    <Icon className={`h-6 w-6 ${p.color}`} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{p.title}</p>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Truck, CreditCard, RotateCcw, MessageCircle } from "lucide-react";

const PILLARS = [
  {
    icon: Truck,
    title: "Livraison 24-48h",
    desc: "Partout au Maroc. Suivi en temps réel.",
    bg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    border: "border-indigo-100",
    shadow: "shadow-indigo-500/10",
  },
  {
    icon: CreditCard,
    title: "Paiement à la livraison",
    desc: "Vous payez uniquement à la réception.",
    bg: "bg-green-50",
    iconColor: "text-green-600",
    border: "border-green-100",
    shadow: "shadow-green-500/10",
  },
  {
    icon: RotateCcw,
    title: "Retour facile",
    desc: "48h pour changer d'avis, sans questions.",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    border: "border-violet-100",
    shadow: "shadow-violet-500/10",
  },
  {
    icon: MessageCircle,
    title: "Support WhatsApp",
    desc: "Une équipe disponible 7j/7 pour vous aider.",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    border: "border-emerald-100",
    shadow: "shadow-emerald-500/10",
  },
];

export function TrustBanner() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">Pourquoi nous choisir</p>
          <h2 className="text-3xl font-black text-slate-900">Votre satisfaction, notre priorité</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PILLARS.map(({ icon: Icon, title, desc, bg, iconColor, border, shadow }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
              whileHover={{ y: -4 }}
              className={`rounded-3xl border ${border} ${bg} p-6 text-center shadow-xl ${shadow} flex flex-col items-center gap-3`}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ${shadow}`}>
                <Icon className={`h-7 w-7 ${iconColor}`} />
              </div>
              <p className="text-sm font-black text-slate-900">{title}</p>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

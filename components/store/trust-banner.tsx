"use client";

import { motion } from "framer-motion";

const PILLARS = [
  {
    emoji: "🚚",
    title: "Livraison Rapide",
    desc: "Partout au Maroc en 24–48h",
    bg: "bg-blue-50",
    shadow: "shadow-blue-500/15",
  },
  {
    emoji: "💳",
    title: "Paiement à la Livraison",
    desc: "Aucun risque, vous payez à réception",
    bg: "bg-green-50",
    shadow: "shadow-green-500/15",
  },
  {
    emoji: "🔍",
    title: "Produits Vérifiés",
    desc: "Chaque article testé et certifié",
    bg: "bg-violet-50",
    shadow: "shadow-violet-500/15",
  },
  {
    emoji: "💬",
    title: "Support WhatsApp",
    desc: "Réponse en moins de 2 heures",
    bg: "bg-cyan-50",
    shadow: "shadow-cyan-500/15",
  },
];

export function TrustBanner() {
  return (
    <section className="px-4 py-12 md:py-16 mb-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Pourquoi ELECTRO.ma ?
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Nous nous occupons de tout, vous jouez serein
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.09, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className={`rounded-3xl ${p.bg} shadow-lg ${p.shadow} p-5 flex flex-col gap-3 text-center items-center`}
            >
              <span className="text-3xl">{p.emoji}</span>
              <div>
                <p className="font-bold text-slate-800 text-sm">{p.title}</p>
                <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

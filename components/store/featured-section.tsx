"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingCart } from "lucide-react";

const PRODUCTS = [
  {
    id: "1",
    name: "PlayStation 5 Slim",
    platform: "PlayStation",
    price: 6_490,
    badge: "Nouveau",
    badgeBg: "bg-blue-600",
    emoji: "🎮",
    cardBg: "bg-gradient-to-b from-blue-50 to-indigo-50",
    iconGradient: "from-blue-500 to-indigo-600",
    // Colored card shadow — the key Claymorphism trick
    shadowClass: "shadow-[0_10px_36px_-6px_rgba(99,102,241,0.30)]",
    ctaGradient: "from-blue-600 to-indigo-600",
    ctaShadow: "shadow-[0_4px_16px_-2px_rgba(99,102,241,0.45)]",
  },
  {
    id: "2",
    name: "Xbox Series S",
    platform: "Xbox",
    price: 4_290,
    badge: "Stock limité",
    badgeBg: "bg-green-600",
    emoji: "🕹️",
    cardBg: "bg-gradient-to-b from-green-50 to-emerald-50",
    iconGradient: "from-green-500 to-emerald-600",
    shadowClass: "shadow-[0_10px_36px_-6px_rgba(16,185,129,0.28)]",
    ctaGradient: "from-green-500 to-emerald-600",
    ctaShadow: "shadow-[0_4px_16px_-2px_rgba(16,185,129,0.40)]",
  },
  {
    id: "3",
    name: "Nintendo Switch OLED",
    platform: "Nintendo",
    price: 3_490,
    badge: "Top vente",
    badgeBg: "bg-red-500",
    emoji: "🌟",
    cardBg: "bg-gradient-to-b from-red-50 to-orange-50",
    iconGradient: "from-red-500 to-orange-500",
    shadowClass: "shadow-[0_10px_36px_-6px_rgba(239,68,68,0.26)]",
    ctaGradient: "from-red-500 to-orange-500",
    ctaShadow: "shadow-[0_4px_16px_-2px_rgba(239,68,68,0.38)]",
  },
  {
    id: "4",
    name: "PS5 Occasion — Grade A",
    platform: "Occasion certifiée",
    price: 4_990,
    badge: "−15%",
    badgeBg: "bg-cyan-600",
    emoji: "✨",
    cardBg: "bg-gradient-to-b from-cyan-50 to-sky-50",
    iconGradient: "from-cyan-500 to-sky-600",
    shadowClass: "shadow-[0_10px_36px_-6px_rgba(6,182,212,0.28)]",
    ctaGradient: "from-cyan-500 to-sky-600",
    ctaShadow: "shadow-[0_4px_16px_-2px_rgba(6,182,212,0.38)]",
  },
];

export function FeaturedSection() {
  return (
    <section className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mb-7 flex items-end justify-between"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              ⚡ Meilleures Offres
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Sélection du moment · Prix MAD · Livraison incluse
            </p>
          </div>
          <Link
            href="/p"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
          >
            Voir tout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Product cards */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 28, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.09, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -8, scale: 1.025 }}
              className="group"
            >
              <Link href="/p" className="block h-full">
                <div
                  className={`
                    ${p.cardBg} ${p.shadowClass}
                    rounded-3xl overflow-hidden flex flex-col h-full
                    border border-white/70
                  `}
                >
                  {/* ── Visual zone ── */}
                  <div className="relative flex items-center justify-center py-8">
                    {/* Badge — pill anchored top-left inside padding, never overflows */}
                    <span
                      className={`
                        absolute left-3 top-3
                        ${p.badgeBg} text-white
                        rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide
                        shadow-sm
                      `}
                    >
                      {p.badge}
                    </span>

                    {/* Product icon */}
                    <div
                      className={`
                        h-16 w-16 rounded-2xl flex items-center justify-center
                        bg-gradient-to-br ${p.iconGradient}
                        shadow-lg
                      `}
                    >
                      <span className="text-3xl leading-none">{p.emoji}</span>
                    </div>
                  </div>

                  {/* ── Info zone ── */}
                  <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4">
                    <div>
                      <p className="text-sm font-bold leading-tight text-slate-800 line-clamp-2">
                        {p.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{p.platform}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-base font-extrabold text-slate-900">
                        {p.price.toLocaleString("fr-MA")}
                        <span className="ml-1 text-xs font-medium text-slate-400">MAD</span>
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-semibold text-slate-600">4.9</span>
                      </div>
                    </div>

                    {/*
                      CTA: solid gradient button, white text, full-width pill.
                      Visible immediately (not just on hover) — impossible to ignore.
                    */}
                    <button
                      className={`
                        mt-auto w-full rounded-full
                        bg-gradient-to-r ${p.ctaGradient} ${p.ctaShadow}
                        py-2 text-xs font-bold text-white
                        flex items-center justify-center gap-1.5
                        hover:opacity-90 active:scale-95
                        transition-all duration-150
                      `}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Commander
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-7 flex justify-center md:hidden"
        >
          <Link
            href="/p"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white btn-glow"
          >
            Voir tout le catalogue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

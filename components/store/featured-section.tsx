"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";

const PLACEHOLDER_PRODUCTS = [
  {
    id: "1",
    name: "PlayStation 5 Slim",
    platform: "PlayStation",
    price: 6490,
    badge: "Nouveau",
    badgeColor: "bg-blue-100 text-blue-700",
    emoji: "🎮",
    gradient: "from-blue-50 to-indigo-50",
    iconGradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/15",
  },
  {
    id: "2",
    name: "Xbox Series S",
    platform: "Xbox",
    price: 4290,
    badge: "Stock limité",
    badgeColor: "bg-green-100 text-green-700",
    emoji: "🕹️",
    gradient: "from-green-50 to-emerald-50",
    iconGradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/15",
  },
  {
    id: "3",
    name: "Nintendo Switch OLED",
    platform: "Nintendo",
    price: 3490,
    badge: "Top vente",
    badgeColor: "bg-red-100 text-red-700",
    emoji: "🌟",
    gradient: "from-red-50 to-orange-50",
    iconGradient: "from-red-500 to-orange-500",
    shadow: "shadow-red-500/15",
  },
  {
    id: "4",
    name: "PS5 — Grade A",
    platform: "Occasion",
    price: 4990,
    badge: "Occasion",
    badgeColor: "bg-cyan-100 text-cyan-700",
    emoji: "✨",
    gradient: "from-cyan-50 to-sky-50",
    iconGradient: "from-cyan-500 to-sky-600",
    shadow: "shadow-cyan-500/15",
  },
];

export function FeaturedSection() {
  return (
    <section className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-7"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              ⚡ Meilleures Offres
            </h2>
            <p className="text-slate-500 text-sm mt-1">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PLACEHOLDER_PRODUCTS.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 32, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -7, scale: 1.02 }}
              className="group cursor-pointer"
            >
              <Link href="/p">
                <div
                  className={`card-float ${product.shadow} bg-gradient-to-br ${product.gradient} overflow-hidden flex flex-col`}
                >
                  {/* Image area */}
                  <div className="relative flex items-center justify-center py-7">
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${product.iconGradient} shadow-lg`}
                    >
                      <span className="text-3xl">{product.emoji}</span>
                    </div>
                    {/* Badge */}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${product.badgeColor}`}
                    >
                      {product.badge}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="px-4 pb-4 flex flex-col gap-2">
                    <div>
                      <p className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{product.platform}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-base">
                        {product.price.toLocaleString("fr-MA")}
                        <span className="text-xs font-medium text-slate-500 ml-1">MAD</span>
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-semibold text-slate-600">4.9</span>
                      </div>
                    </div>

                    <button className="w-full rounded-full bg-white/80 border border-slate-200 py-1.5 text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                      Commander →
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-6 flex justify-center md:hidden"
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

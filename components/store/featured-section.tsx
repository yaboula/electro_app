"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShoppingCart, Heart } from "lucide-react";

const PRODUCTS = [
  {
    id: "1",
    name: "PlayStation 5 Slim — Édition Standard",
    platform: "PlayStation",
    price: 6_490,
    original: 7_200,
    discount: 10,
    rating: 4.9,
    reviews: 214,
    badge: "Nouveau",
    badgeBg: "bg-blue-600",
    img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Xbox Series S — Glacier White",
    platform: "Xbox",
    price: 4_290,
    original: 4_690,
    discount: 9,
    rating: 4.8,
    reviews: 156,
    badge: "Stock limité",
    badgeBg: "bg-orange-500",
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Nintendo Switch OLED — Édition Blanche",
    platform: "Nintendo",
    price: 3_490,
    original: 3_890,
    discount: 10,
    rating: 4.9,
    reviews: 312,
    badge: "Top vente",
    badgeBg: "bg-red-500",
    img: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Manette DualSense — Cosmic Red",
    platform: "Accessoire PS5",
    price: 990,
    original: 1_200,
    discount: 18,
    rating: 4.7,
    reviews: 89,
    badge: "−18%",
    badgeBg: "bg-violet-600",
    img: "https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Casque Gaming — Sans Fil 7.1",
    platform: "Accessoire",
    price: 1_290,
    original: 1_690,
    discount: 24,
    rating: 4.6,
    reviews: 47,
    badge: "Promo",
    badgeBg: "bg-green-600",
    img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "FIFA 25 — PS5 & Xbox",
    platform: "Jeu vidéo",
    price: 490,
    original: 590,
    discount: 17,
    rating: 4.5,
    reviews: 203,
    badge: "Populaire",
    badgeBg: "bg-cyan-600",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80&auto=format&fit=crop",
  },
];

export function FeaturedSection() {
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
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
              Sélection du moment · Paiement à la livraison · Stock en temps réel
            </p>
          </div>
          <Link href="/p"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
            Tout voir <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PRODUCTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              className="product-card group flex flex-col overflow-hidden"
            >
              <Link href="/p" className="flex flex-col flex-1">
                {/* Image */}
                <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/30">
                  <Image
                    src={p.img}
                    alt={p.name}
                    width={300}
                    height={300}
                    className="w-full aspect-square object-cover group-hover:scale-106 transition-transform duration-400"
                  />
                  {/* Badge */}
                  <span className={`absolute left-2.5 top-2.5 ${p.badgeBg} rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white`}>
                    {p.badge}
                  </span>
                  {p.discount > 0 && (
                    <span className="absolute right-2.5 top-2.5 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      −{p.discount}%
                    </span>
                  )}
                  {/* Wishlist */}
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all shadow-sm">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1.5 p-3">
                  <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">{p.platform}</p>
                  <p className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{p.name}</p>

                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700">{p.rating}</span>
                    <span className="text-xs text-slate-400">({p.reviews})</span>
                  </div>

                  <div className="mt-auto pt-1.5">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {p.price.toLocaleString("fr-MA")}
                        <span className="text-xs font-medium text-slate-400 ml-1">MAD</span>
                      </span>
                      {p.original > p.price && (
                        <span className="text-xs text-slate-400 line-through">
                          {p.original.toLocaleString("fr-MA")}
                        </span>
                      )}
                    </div>

                    <button className="w-full flex items-center justify-center gap-1.5 rounded-full bg-blue-600 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/25 hover:bg-blue-700 active:scale-95 transition-all">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Commander
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-7 flex justify-center md:hidden"
        >
          <Link href="/p"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3 text-sm font-bold text-white btn-glow">
            Voir tout le catalogue <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

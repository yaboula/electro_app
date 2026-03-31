"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star, ArrowRight } from "lucide-react";

const PRODUCTS = [
  {
    name: "PS5 Standard",
    platform: "PlayStation",
    img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    price: 4599,
    badge: "Nouveau",
    badgeColor: "bg-indigo-600 text-white",
    rating: 4.9,
    shadow: "shadow-indigo-500/20",
  },
  {
    name: "Xbox Series S",
    platform: "Xbox",
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80",
    price: 3299,
    badge: "Top vente",
    badgeColor: "bg-green-600 text-white",
    rating: 4.7,
    shadow: "shadow-green-500/20",
  },
  {
    name: "Switch OLED Blanc",
    platform: "Nintendo",
    img: "https://images.unsplash.com/photo-1598246964989-7bba3a3d7c7e?w=400&q=80",
    price: 2799,
    badge: "Populaire",
    badgeColor: "bg-red-500 text-white",
    rating: 4.9,
    shadow: "shadow-red-500/20",
  },
  {
    name: "DualSense Midnight",
    platform: "PlayStation",
    img: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=400&q=80",
    price: 899,
    badge: "Nouveau",
    badgeColor: "bg-violet-600 text-white",
    rating: 4.8,
    shadow: "shadow-violet-500/20",
  },
  {
    name: "GTA VI",
    platform: "PlayStation",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&q=80",
    price: 599,
    badge: "Pré-commande",
    badgeColor: "bg-orange-500 text-white",
    rating: 5.0,
    shadow: "shadow-orange-500/20",
  },
  {
    name: "Xbox Elite Pad v2",
    platform: "Xbox",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&q=80",
    price: 1499,
    badge: "Stock limité",
    badgeColor: "bg-rose-500 text-white",
    rating: 4.6,
    shadow: "shadow-rose-500/20",
  },
];

const WA_BASE = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

export function FeaturedSection() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">Sélection</p>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Meilleures offres</h2>
          </div>
          <Link href="/p" className="hidden md:flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PRODUCTS.map(({ name, platform, img, price, badge, badgeColor, rating, shadow }, i) => {
            const waMsg = `Bonjour, je suis intéressé par ${name} à ${price} MAD`;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: "easeOut" }}
                className={`product-card group flex flex-col overflow-hidden shadow-xl ${shadow}`}
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <Image src={img} alt={name} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 17vw"
                  />
                  {/* Badge */}
                  <span className={`absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[10px] font-black ${badgeColor} shadow-sm`}>
                    {badge}
                  </span>
                  {/* Wishlist */}
                  <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-400 opacity-0 group-hover:opacity-100 transition-all hover:text-rose-500 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 p-3 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-indigo-500">{platform}</p>
                  <p className="text-xs font-black text-slate-900 leading-tight line-clamp-2">{name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-slate-600">{rating}</span>
                  </div>
                  <p className="mt-auto text-base font-black text-indigo-700">{price.toLocaleString()} MAD</p>
                  <a
                    href={`${WA_BASE}?text=${encodeURIComponent(waMsg)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="clay-btn flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 py-2 text-[11px] font-black text-white"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Commander
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

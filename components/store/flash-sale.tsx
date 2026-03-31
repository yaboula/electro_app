"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(left / 3600)).padStart(2, "0");
  const m = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const s = String(left % 60).padStart(2, "0");
  return { h, m, s };
}

const DEALS = [
  {
    name: "PlayStation 5 Slim",
    platform: "Sony",
    img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400&q=80",
    price: 3999,
    was: 5200,
    rating: 4.9,
    reviews: 128,
    shadow: "shadow-indigo-500/25",
  },
  {
    name: "Xbox Series X",
    platform: "Microsoft",
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80",
    price: 4200,
    was: 5500,
    rating: 4.8,
    reviews: 94,
    shadow: "shadow-green-500/25",
  },
  {
    name: "Nintendo Switch OLED",
    platform: "Nintendo",
    img: "https://images.unsplash.com/photo-1598246964989-7bba3a3d7c7e?w=400&q=80",
    price: 2499,
    was: 3100,
    rating: 4.9,
    reviews: 211,
    shadow: "shadow-red-500/25",
  },
  {
    name: "DualSense Edge",
    platform: "Sony",
    img: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=400&q=80",
    price: 1299,
    was: 1800,
    rating: 4.7,
    reviews: 76,
    shadow: "shadow-violet-500/25",
  },
];

const WA_BASE = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

export function FlashSale() {
  const { h, m, s } = useCountdown(4 * 3600 + 37 * 60 + 22);

  return (
    <section className="py-12 px-6 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950 rounded-none md:rounded-[2.5rem] mx-0 md:mx-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/30">
              <Zap className="h-5 w-5 fill-white text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-orange-400 mb-0.5">Offre limitée</p>
              <h2 className="text-2xl font-black text-white">Flash Sale</h2>
            </div>
          </div>
          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white/50 mr-1">Fin dans</span>
            {[{ v: h, l: "H" }, { v: m, l: "M" }, { v: s, l: "S" }].map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-2">
                <div className="text-center">
                  <div className="min-w-[48px] rounded-2xl bg-white/10 px-3 py-2 text-2xl font-black text-white tabular-nums text-center leading-none backdrop-blur-sm border border-white/10">
                    {v}
                  </div>
                  <p className="mt-1 text-[10px] font-bold text-white/40 uppercase">{l}</p>
                </div>
                {i < 2 && <span className="text-xl font-black text-white/40 mb-3">:</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {DEALS.map(({ name, platform, img, price, was, rating, reviews, shadow }, i) => {
            const pct = Math.round((1 - price / was) * 100);
            const waMsg = `Bonjour, je suis intéressé par ${name} à ${price} MAD`;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative bg-white rounded-3xl shadow-2xl ${shadow} border border-white/10 overflow-hidden flex flex-col`}
              >
                {/* Discount badge */}
                <div className="absolute top-3 right-3 z-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 px-2.5 py-0.5 text-xs font-black text-white shadow-md shadow-red-500/30">
                  -{pct}%
                </div>
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-slate-50">
                  <Image src={img} alt={name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
                </div>
                {/* Info */}
                <div className="flex flex-col gap-2 p-4 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500">{platform}</p>
                  <p className="text-sm font-black text-slate-900 leading-tight">{name}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-600">{rating}</span>
                    <span className="text-xs text-slate-400">({reviews})</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-lg font-black text-indigo-700">{price.toLocaleString()} MAD</span>
                    <span className="text-xs text-slate-400 line-through">{was.toLocaleString()}</span>
                  </div>
                  <a
                    href={`${WA_BASE}?text=${encodeURIComponent(waMsg)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="clay-btn mt-1 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 py-2.5 text-xs font-black text-white"
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

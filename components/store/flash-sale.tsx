"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Star, ShoppingCart } from "lucide-react";

/* Countdown helpers */
function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    h: Math.floor(diff / 3_600_000),
    m: Math.floor((diff % 3_600_000) / 60_000),
    s: Math.floor((diff % 60_000) / 1_000),
  };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-slate-900 text-white font-extrabold text-xl md:text-2xl tabular-nums shadow-inner">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

const FLASH_PRODUCTS = [
  {
    id: "f1",
    name: "Manette DualSense PS5",
    price: 890,
    original: 1_100,
    discount: 19,
    rating: 4.8,
    reviews: 64,
    img: "https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=400&q=80&auto=format&fit=crop",
    badge: "Flash",
  },
  {
    id: "f2",
    name: "Nintendo Switch OLED",
    price: 3_290,
    original: 3_890,
    discount: 15,
    rating: 4.9,
    reviews: 112,
    img: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80&auto=format&fit=crop",
    badge: "−15%",
  },
  {
    id: "f3",
    name: "Casque Gaming SteelSeries",
    price: 1_190,
    original: 1_590,
    discount: 25,
    rating: 4.7,
    reviews: 38,
    img: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80&auto=format&fit=crop",
    badge: "−25%",
  },
  {
    id: "f4",
    name: "Xbox Series S — Glacier White",
    price: 3_990,
    original: 4_490,
    discount: 11,
    rating: 4.8,
    reviews: 87,
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80&auto=format&fit=crop",
    badge: "Limité",
  },
];

export function FlashSale() {
  // Target: 6 hours from mount
  const [target] = useState(() => new Date(Date.now() + 6 * 3_600_000));
  const [time, setTime] = useState(getTimeLeft(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(target)), 1_000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <section className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="section-card overflow-hidden">
          {/* Header bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Zap className="h-5 w-5 fill-yellow-300 text-yellow-300" />
              </div>
              <div>
                <p className="font-extrabold text-white text-lg leading-none">Flash Sale</p>
                <p className="text-white/70 text-xs mt-0.5">Offres limitées dans le temps</p>
              </div>
            </div>

            {/* Countdown */}
            <div className="flex items-center gap-3">
              <span className="text-white/70 text-xs font-medium hidden sm:block">Se termine dans</span>
              <div className="flex items-center gap-2">
                <CountdownUnit value={time.h} label="Hrs" />
                <span className="text-white font-bold text-xl mb-4">:</span>
                <CountdownUnit value={time.m} label="Mins" />
                <span className="text-white font-bold text-xl mb-4">:</span>
                <CountdownUnit value={time.s} label="Secs" />
              </div>
            </div>

            <Link href="/p" className="hidden md:flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 text-sm font-semibold text-white">
              Voir tout <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Products row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y divide-slate-100">
            {FLASH_PRODUCTS.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                whileHover={{ backgroundColor: "#f8faff" }}
                className="group flex flex-col p-4 md:p-5 cursor-pointer transition-colors"
              >
                <Link href="/p" className="flex flex-col flex-1">
                  {/* Image */}
                  <div className="relative mb-3 overflow-hidden rounded-2xl bg-slate-50">
                    <Image
                      src={p.img}
                      alt={p.name}
                      width={300}
                      height={300}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      {p.badge}
                    </span>
                    <span className="absolute top-2 right-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
                      −{p.discount}%
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight mb-1">{p.name}</p>

                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-semibold text-slate-700">{p.rating}</span>
                    <span className="text-[11px] text-slate-400">({p.reviews})</span>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1.5 mb-2">
                      <span className="text-base font-extrabold text-slate-900">
                        {p.price.toLocaleString("fr-MA")} MAD
                      </span>
                      <span className="text-xs font-medium text-slate-400 line-through">
                        {p.original.toLocaleString("fr-MA")}
                      </span>
                    </div>

                    <button className="w-full flex items-center justify-center gap-1.5 rounded-full bg-blue-600 py-2 text-xs font-bold text-white shadow-sm shadow-blue-500/30 hover:bg-blue-700 active:scale-95 transition-all">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      Commander
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

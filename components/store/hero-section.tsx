"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star, Shield, Truck, Zap } from "lucide-react";

const fadeLeft = {
  hidden: { opacity: 0, x: -32 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" as const },
  }),
};
const fadeRight = {
  hidden: { opacity: 0, x: 32, scale: 0.96 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { delay: 0.2, duration: 0.6, ease: "easeOut" as const } },
};

const TRUST_PILLS = [
  { icon: Shield, label: "Garanti 6 mois" },
  { icon: Truck,  label: "Livraison 24–48h" },
  { icon: Zap,    label: "Paiement livraison" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#f0f4ff] to-[#f5f3ff] pt-8 pb-10 md:pt-12 md:pb-14">
      {/* Blobs */}
      <div className="blob w-[500px] h-[500px] bg-blue-400 -top-32 -right-24" />
      <div className="blob w-80 h-80 bg-violet-400 bottom-0 left-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">

          {/* ── Left: copy ── */}
          <div className="flex flex-col gap-5 order-2 md:order-1">
            <motion.div custom={0} variants={fadeLeft} initial="hidden" animate="visible">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3.5 py-1 text-xs font-bold text-white shadow-md shadow-blue-500/30">
                🔥 Offres Exclusives — Été 2025
              </span>
            </motion.div>

            <motion.h1
              custom={1} variants={fadeLeft} initial="hidden" animate="visible"
              className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.08] tracking-tight text-slate-900"
            >
              Jouez Plus,{" "}
              <span className="relative inline-block">
                <span className="gradient-text">Payez Moins</span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6 Q100 2 198 6" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              </span>
              <br />
              au Maroc 🇲🇦
            </motion.h1>

            <motion.p
              custom={2} variants={fadeLeft} initial="hidden" animate="visible"
              className="text-base md:text-lg text-slate-500 leading-relaxed max-w-lg"
            >
              Consoles neuves &amp; occasion, jeux vidéo et accessoires gaming.
              Livraison partout au Maroc avec{" "}
              <strong className="text-blue-700">paiement à la livraison.</strong>
            </motion.p>

            <motion.div
              custom={3} variants={fadeLeft} initial="hidden" animate="visible"
              className="flex flex-wrap gap-3"
            >
              <Link href="/p"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-bold text-white btn-glow hover:-translate-y-0.5 active:translate-y-0 transition-transform">
                Voir les offres
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/item"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all">
                🔄 Occasion certifiée
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              custom={4} variants={fadeLeft} initial="hidden" animate="visible"
              className="flex flex-wrap gap-2.5 mt-1"
            >
              {TRUST_PILLS.map(({ icon: Icon, label }) => (
                <span key={label}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm">
                  <Icon className="h-3.5 w-3.5 text-blue-600" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* Social proof */}
            <motion.div
              custom={5} variants={fadeLeft} initial="hidden" animate="visible"
              className="flex items-center gap-3 mt-1"
            >
              <div className="flex -space-x-2">
                {["https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=40&h=40&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&crop=face",
                ].map((src, i) => (
                  <Image key={i} src={src} alt="client" width={32} height={32}
                    className="h-8 w-8 rounded-full border-2 border-white object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {Array(5).fill(0).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">+2 400 clients satisfaits</p>
              </div>
            </motion.div>
          </div>

          {/* ── Right: hero image ── */}
          <motion.div
            variants={fadeRight} initial="hidden" animate="visible"
            className="relative order-1 md:order-2"
          >
            {/* Main image card */}
            <div className="relative rounded-3xl overflow-hidden shadow-[0_24px_60px_-12px_rgba(37,99,235,0.28)]">
              <Image
                src="https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=700&q=80&auto=format&fit=crop"
                alt="PlayStation 5"
                width={700}
                height={525}
                priority
                className="w-full object-cover rounded-3xl"
                style={{ aspectRatio: "4/3" }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent rounded-3xl" />

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium">Produit phare</p>
                    <p className="text-white font-extrabold text-xl leading-tight">PlayStation 5 Slim</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-white/80 text-xs font-medium">4.9 · 128 avis</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-xs line-through">7 200 MAD</p>
                    <p className="text-white font-extrabold text-2xl">6 490 MAD</p>
                    <Link href="/p"
                      className="mt-1 inline-flex items-center gap-1 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50 transition-colors">
                      Commander <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badge — top right */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 6 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 260 }}
              className="absolute -top-4 -right-4 hidden md:flex flex-col items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg shadow-orange-500/35 text-white"
            >
              <span className="text-[11px] font-bold leading-tight">Jusqu'à</span>
              <span className="text-2xl font-extrabold leading-none">−50%</span>
              <span className="text-[10px] font-semibold opacity-80">Occasion</span>
            </motion.div>

            {/* Floating mini card — bottom left */}
            <motion.div
              initial={{ opacity: 0, x: -20, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute -bottom-5 -left-4 hidden md:flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-blue-500/15 border border-blue-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shrink-0">
                <span className="text-xl">🎮</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Xbox Series S</p>
                <p className="text-xs text-slate-500">Dès 4 290 MAD</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

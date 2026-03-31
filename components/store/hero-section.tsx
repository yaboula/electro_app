"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, TrendingUp, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const SplineScene = dynamic(
  () => import("./spline-scene").then((m) => ({ default: m.SplineScene })),
  { ssr: false, loading: () => <Fallback3D /> }
);

/* ── countdown target: 48h from now ── */
function useCountdown(hours = 48) {
  const [t, setT] = useState({ h: "47", m: "59", s: "59" });
  useEffect(() => {
    const end = Date.now() + hours * 3600 * 1000;
    const id = setInterval(() => {
      const diff = Math.max(0, end - Date.now());
      const hh = String(Math.floor(diff / 3_600_000)).padStart(2, "0");
      const mm = String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0");
      const ss = String(Math.floor((diff % 60_000) / 1000)).padStart(2, "0");
      setT({ h: hh, m: mm, s: ss });
    }, 1000);
    return () => clearInterval(id);
  }, [hours]);
  return t;
}

function Fallback3D() {
  return (
    <div className="relative flex h-full min-h-[420px] items-center justify-center">
      {/* Clay-style product image as fallback */}
      <motion.div
        animate={{ y: [0, -16, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div className="absolute inset-0 rounded-3xl blur-3xl opacity-30 bg-gradient-to-br from-indigo-400 to-violet-500" />
        <Image
          src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=85"
          alt="PlayStation 5"
          width={380}
          height={380}
          className="relative z-10 drop-shadow-2xl"
          style={{ objectFit: "contain", borderRadius: "1.5rem" }}
          priority
        />
      </motion.div>
      {/* floating orbs */}
      <motion.div animate={{ y: [0,-10,0], rotate: [0,10,0] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
        className="absolute top-8 right-8 h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-400 to-indigo-500 shadow-lg shadow-violet-500/30 flex items-center justify-center">
        <Zap className="h-7 w-7 text-white fill-white" />
      </motion.div>
      <motion.div animate={{ y: [0,10,0] }} transition={{ duration: 3, repeat: Infinity, delay: 1 }}
        className="absolute bottom-10 left-6 h-12 w-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg shadow-pink-500/30" />
      <motion.div animate={{ y: [0,-8,0], scale: [1,1.08,1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
        className="absolute top-1/4 left-4 h-10 w-10 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 shadow-md shadow-yellow-400/30" />
    </div>
  );
}

const BADGES = [
  { icon: Shield,    label: "Garantie 6 mois", color: "bg-green-50 text-green-700 border-green-100" },
  { icon: Zap,       label: "Livraison 24-48h", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { icon: TrendingUp,label: "+2000 clients",    color: "bg-violet-50 text-violet-700 border-violet-100" },
];

const PROMO_IMG = "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=180&q=80";

const fadeLeft  = { hidden: { opacity: 0, x: -36 }, show: { opacity: 1, x: 0 } };
const fadeRight = { hidden: { opacity: 0, x:  36 }, show: { opacity: 1, x: 0 } };

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export function HeroSection() {
  const t = useCountdown(48);

  return (
    <section className="relative overflow-hidden page-bg">
      {/* ── background blobs ── */}
      <div className="blob w-[600px] h-[600px] bg-violet-400/25 -top-40 -left-32 z-0" />
      <div className="blob w-[500px] h-[400px] bg-indigo-400/20 -top-20 right-0 z-0" />
      <div className="blob w-[400px] h-[300px] bg-pink-300/15 bottom-0 left-1/3 z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── LEFT: text + CTA ── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6"
          >
            {/* Tag */}
            <motion.div variants={fadeLeft}>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                N°1 Gaming au Maroc
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeLeft} className="display-black text-5xl md:text-6xl lg:text-7xl">
              L&apos;Univers du
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                Gaming
              </span>
              <br />
              au Maroc.
            </motion.h1>

            {/* Sub */}
            <motion.p variants={fadeLeft} className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
              Consoles neuves, jeux, accessoires et produits <strong className="text-slate-700">d&apos;occasion certifiés</strong>.
              Livraison partout au Maroc, paiement à la livraison.
            </motion.p>

            {/* Badges */}
            <motion.div variants={fadeLeft} className="flex flex-wrap gap-2.5">
              {BADGES.map(({ icon: Icon, label, color }) => (
                <span key={label} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeLeft} className="flex flex-wrap gap-3">
              <Link href="/p"
                className="clay-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-black text-white">
                <ShoppingCart className="h-4.5 w-4.5" />
                Voir le catalogue
              </Link>
              <Link href="/item"
                className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-200 bg-white px-7 py-3.5 text-sm font-black text-indigo-700 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 transition-all">
                Produits Occasion
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={fadeLeft} className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {["20", "30", "40", "50"].map((n) => (
                  <Image key={n}
                    src={`https://i.pravatar.cc/40?img=${n}`}
                    alt="client"
                    width={36} height={36}
                    className="h-9 w-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-xs font-bold text-slate-700">4.9</span>
                </div>
                <p className="text-xs text-slate-500">+2 000 clients satisfaits</p>
              </div>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: 3D scene + promo card ── */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="show"
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {/* 3D scene container */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-50 to-violet-100 min-h-[440px] shadow-2xl shadow-indigo-500/20 border border-white/80">
              <SplineScene />
            </div>

            {/* ── Floating PROMO card (like MetaMarket bid card) ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
              className="absolute -bottom-6 -left-6 z-20"
            >
              <div className="clay-card-violet p-4 flex gap-3 items-center w-64 bg-white">
                <Image
                  src={PROMO_IMG}
                  alt="PS5 Promo"
                  width={56} height={56}
                  className="h-14 w-14 rounded-2xl object-cover shadow-lg shadow-violet-400/30 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-0.5">Flash Deal</p>
                  <p className="text-sm font-black text-slate-900 truncate">PlayStation 5 Slim</p>
                  <p className="text-lg font-black text-indigo-700 leading-tight">3 999 MAD</p>
                </div>
              </div>
            </motion.div>

            {/* ── Countdown card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
              className="absolute -top-6 -right-4 z-20"
            >
              <div className="clay-card p-3.5 w-48 bg-white">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Fin de l&apos;offre dans</p>
                <div className="flex items-center gap-1.5">
                  {[{ v: t.h, label: "Hrs" }, { v: t.m, label: "Min" }, { v: t.s, label: "Sec" }].map(({ v, label }) => (
                    <div key={label} className="text-center">
                      <div className="rounded-xl bg-gradient-to-b from-indigo-600 to-violet-700 px-2.5 py-1.5 text-xl font-black text-white tabular-nums leading-none shadow-md shadow-indigo-500/30">
                        {v}
                      </div>
                      <p className="mt-1 text-[9px] font-bold text-slate-400 uppercase">{label}</p>
                    </div>
                  ))}
                  <div className="mb-3 text-xl font-black text-indigo-600 self-start mt-1">:</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

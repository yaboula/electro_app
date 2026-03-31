"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Shield, Zap, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

/* ── countdown ── */
function useCountdown(hours = 48) {
  const [t, setT] = useState({ h: "47", m: "59", s: "59" });
  useEffect(() => {
    const end = Date.now() + hours * 3_600_000;
    const id = setInterval(() => {
      const diff = Math.max(0, end - Date.now());
      setT({
        h: String(Math.floor(diff / 3_600_000)).padStart(2, "0"),
        m: String(Math.floor((diff % 3_600_000) / 60_000)).padStart(2, "0"),
        s: String(Math.floor((diff % 60_000) / 1000)).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(id);
  }, [hours]);
  return t;
}

/*
  Floating 3D asset config.
  Sources: Unsplash product shots used as floating elements (already in remotePatterns).
  Replace src with local /assets/3d-*.png once you place the real transparent PNGs
  in the public/assets folder.
*/
const FLOATERS = [
  {
    /* gamepad top-right */
    src: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=300&q=85",
    width: 160,
    height: 160,
    className: "top-[-20px] right-[20px] md:top-[-40px] md:right-[50px]",
    animate: { y: [-14, 14, -14] as number[], rotate: [-6, 6, -6] as number[] },
    duration: 4.5,
    extraClass: "w-[90px] md:w-[160px] rounded-3xl shadow-2xl shadow-indigo-500/25",
  },
  {
    /* console bottom-right — desktop only */
    src: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=300&q=85",
    width: 130,
    height: 130,
    className: "bottom-[30px] right-[-10px] md:bottom-[50px] md:right-[10px] hidden md:block",
    animate: { y: [10, -18, 10] as number[], rotate: [4, -4, 4] as number[] },
    duration: 5.5,
    extraClass: "w-[130px] rounded-3xl shadow-2xl shadow-green-500/25",
  },
  {
    /* Nintendo left — desktop only */
    src: "https://images.unsplash.com/photo-1598246964989-7bba3a3d7c7e?w=300&q=85",
    width: 120,
    height: 120,
    className: "top-[42%] left-[-24px] hidden md:block",
    animate: { y: [-10, 12, -10] as number[], rotate: [-3, 5, -3] as number[] },
    duration: 6,
    extraClass: "w-[120px] rounded-3xl shadow-2xl shadow-red-500/20",
  },
];

const BADGES = [
  { icon: Shield,     label: "Garantie 6 mois", color: "bg-green-50 text-green-700 border-green-100" },
  { icon: Zap,        label: "Livraison 24-48h", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { icon: TrendingUp, label: "+2 000 clients",   color: "bg-violet-50 text-violet-700 border-violet-100" },
];

const PROMO_IMG = "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=180&q=80";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } },
};
const fadeLeft = { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } } };

export function HeroSection() {
  const t = useCountdown(48);

  return (
    <section className="relative overflow-hidden page-bg min-h-[92vh] flex items-center">
      {/* ── background blobs ── */}
      <div className="blob w-[620px] h-[520px] bg-violet-400/22 -top-40 -left-28 z-0" />
      <div className="blob w-[500px] h-[400px] bg-indigo-400/18 -top-20 right-0 z-0" />
      <div className="blob w-[380px] h-[300px] bg-pink-300/14 bottom-0 left-1/3 z-0" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ───── LEFT: copy ───── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col gap-6 order-2 lg:order-1"
          >
            {/* Tag chip */}
            <motion.div variants={fadeLeft}>
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-bold text-indigo-700">
                <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                N°1 Gaming au Maroc
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeLeft} className="display-black text-5xl md:text-6xl lg:text-[68px]">
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
              Consoles neuves, jeux, accessoires et produits{" "}
              <strong className="text-slate-700">d&apos;occasion certifiés</strong>.
              Livraison partout au Maroc, paiement à la livraison.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={fadeLeft} className="flex flex-wrap gap-2.5">
              {BADGES.map(({ icon: Icon, label, color }) => (
                <span key={label} className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold ${color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={fadeLeft} className="flex flex-wrap gap-3">
              <Link href="/p"
                className="clay-btn inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-black text-white">
                <ShoppingCart className="h-4 w-4" />
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

          {/* ───── RIGHT: visual stage with floating 3D assets ───── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative flex items-center justify-center order-1 lg:order-2 min-h-[340px] md:min-h-[480px]"
          >
            {/* Central clay card — hero product */}
            <div className="relative z-10 clay-card-violet w-72 md:w-96 overflow-hidden">
              {/* Product image */}
              <div className="relative h-52 md:h-64 overflow-hidden rounded-t-[1.6rem]">
                <Image
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=85"
                  alt="PlayStation 5"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 288px, 384px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                {/* Flash deal badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-3 py-1 text-xs font-black text-white shadow-md shadow-red-500/30">
                  <Zap className="h-3 w-3 fill-white" />
                  Flash Deal
                </div>
              </div>

              {/* Card info */}
              <div className="p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-0.5">Sony PlayStation</p>
                  <p className="text-base font-black text-slate-900">PS5 Slim</p>
                  <p className="text-xl font-black text-indigo-700">3 999 MAD</p>
                </div>
                {/* Countdown mini */}
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">Fin dans</p>
                  <div className="flex items-center gap-1">
                    {[{ v: t.h, l: "H" }, { v: t.m, l: "M" }, { v: t.s, l: "S" }].map(({ v, l }, i) => (
                      <div key={l} className="flex items-center gap-0.5">
                        <div className="rounded-lg bg-indigo-600 px-1.5 py-1 text-sm font-black text-white tabular-nums leading-none min-w-[28px] text-center">
                          {v}
                        </div>
                        {i < 2 && <span className="text-xs font-black text-slate-400">:</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-[9px] text-slate-400 mt-0.5">{t.h}h {t.m}m {t.s}s</p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="px-4 pb-4">
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}?text=${encodeURIComponent("Bonjour, je suis intéressé par la PS5 Slim à 3999 MAD")}`}
                  target="_blank" rel="noopener noreferrer"
                  className="clay-btn flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-black text-white w-full"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Commander maintenant
                </a>
              </div>
            </div>

            {/* ── Floating 3D assets ── */}
            {FLOATERS.map(({ src, width, height, className, animate, duration, extraClass }) => (
              <motion.div
                key={src}
                animate={animate}
                transition={{ repeat: Infinity, duration, ease: "easeInOut" }}
                className={`absolute pointer-events-none select-none z-20 ${className}`}
              >
                <Image
                  src={src}
                  alt=""
                  width={width}
                  height={height}
                  className={`object-cover aspect-square ${extraClass}`}
                  sizes="160px"
                />
              </motion.div>
            ))}

            {/* ── Floating mini "Occasion" badge card ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
              className="absolute -bottom-4 -left-4 z-20 hidden md:block"
            >
              <div className="clay-card-green flex items-center gap-3 px-4 py-3 w-52 bg-white">
                <Image
                  src={PROMO_IMG}
                  alt="Manette"
                  width={48} height={48}
                  className="h-12 w-12 rounded-2xl object-cover shadow-md shadow-emerald-400/25 shrink-0"
                />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-wide text-emerald-600 mb-0.5">Occasion — Grade A</p>
                  <p className="text-xs font-black text-slate-900">DualSense Midnight</p>
                  <p className="text-sm font-black text-emerald-700">749 MAD</p>
                </div>
              </div>
            </motion.div>

            {/* ── Floating rating badge ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              className="absolute top-0 -left-6 z-20 hidden md:flex"
            >
              <div className="clay-card flex items-center gap-2 px-3 py-2.5 bg-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 shrink-0">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-base font-black text-slate-900 leading-none">4.9/5</p>
                  <p className="text-[10px] text-slate-400 font-semibold">+2 000 avis</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

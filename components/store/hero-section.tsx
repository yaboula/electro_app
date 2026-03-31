"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, ease: "easeOut" as const },
  }),
};

const floatCards = {
  hidden: { opacity: 0, y: 40, scale: 0.92 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.4 + i * 0.14, duration: 0.6, ease: "easeOut" as const },
  }),
};

const GAME_CARDS = [
  {
    emoji: "🎮",
    label: "PS5",
    sublabel: "Dès 6 490 MAD",
    gradient: "from-blue-500 to-violet-600",
    bg: "bg-gradient-to-br from-blue-50 to-violet-50",
    shadow: "shadow-blue-500/20",
  },
  {
    emoji: "🕹️",
    label: "Xbox Series",
    sublabel: "Dès 4 290 MAD",
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    shadow: "shadow-green-500/20",
  },
  {
    emoji: "🌟",
    label: "Nintendo",
    sublabel: "Dès 2 890 MAD",
    gradient: "from-red-500 to-orange-500",
    bg: "bg-gradient-to-br from-red-50 to-orange-50",
    shadow: "shadow-red-500/20",
  },
  {
    emoji: "🔄",
    label: "Occasion",
    sublabel: "Jusqu'à -50%",
    gradient: "from-cyan-500 to-blue-500",
    bg: "bg-gradient-to-br from-cyan-50 to-blue-50",
    shadow: "shadow-cyan-500/20",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90svh] flex flex-col justify-center px-4 py-12 md:py-16 overflow-hidden">
      {/* Background blobs */}
      <div className="blob w-96 h-96 bg-blue-400 top-[-80px] right-[-60px]" />
      <div className="blob w-72 h-72 bg-violet-400 bottom-[60px] left-[-40px]" />
      <div className="blob w-64 h-64 bg-cyan-400 top-[40%] right-[15%]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">

          {/* Left — Text */}
          <div className="flex flex-col gap-5">
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                <Sparkles className="h-3.5 w-3.5" />
                🇲🇦 N°1 du Gaming au Maroc
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900"
            >
              L&apos;Univers du{" "}
              <span className="gradient-text">Gaming</span>{" "}
              <br className="hidden sm:block" />
              au Maroc
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-base md:text-lg text-slate-500 leading-relaxed max-w-md"
            >
              Consoles neuves et d&apos;occasion, jeux vidéo et accessoires.
              Livraison partout au Maroc.{" "}
              <strong className="text-slate-700">Paiement à la livraison.</strong>
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-3"
            >
              <Link
                href="/p"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white btn-glow"
              >
                Explorer le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/item"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 px-7 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                🔄 Voir l&apos;occasion
              </Link>
            </motion.div>

            {/* Trust pills */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2 mt-1"
            >
              {[
                "✅ Livraison rapide",
                "💳 Paiement à la livraison",
                "🔁 Retour facile",
              ].map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium text-slate-500 bg-white rounded-full px-3 py-1 shadow-sm border border-slate-100"
                >
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — Floating cards grid */}
          <div className="grid grid-cols-2 gap-4">
            {GAME_CARDS.map((card, i) => (
              <motion.div
                key={card.label}
                custom={i}
                variants={floatCards}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, scale: 1.03 }}
                transition={{ type: "spring", stiffness: 320, damping: 22 }}
                className={`card-float cursor-pointer ${card.bg} p-5 flex flex-col gap-2 ${
                  i === 0 ? "md:translate-y-4" : i === 3 ? "md:-translate-y-4" : ""
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} shadow-lg ${card.shadow}`}
                >
                  <span className="text-2xl">{card.emoji}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{card.label}</p>
                  <p className="text-xs text-slate-500 font-medium">{card.sublabel}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  Voir <ArrowRight className="h-3 w-3 text-blue-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 md:hidden"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="h-5 w-3 rounded-full border-2 border-slate-300 flex items-start justify-center pt-0.5"
        >
          <div className="h-1 w-0.5 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

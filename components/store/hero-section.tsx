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

// Each card has a dedicated colored shadow that matches its own palette
const GAME_CARDS = [
  {
    emoji: "🎮",
    label: "PS5",
    sublabel: "Dès 6 490 MAD",
    iconGradient: "from-blue-500 to-violet-600",
    cardBg: "bg-gradient-to-br from-blue-50 to-violet-50",
    // shadow color matches card accent
    shadowClass: "shadow-[0_8px_32px_-4px_rgba(99,102,241,0.30)]",
    textGradient: "from-blue-600 to-violet-600",
  },
  {
    emoji: "🕹️",
    label: "Xbox Series",
    sublabel: "Dès 4 290 MAD",
    iconGradient: "from-green-500 to-emerald-600",
    cardBg: "bg-gradient-to-br from-green-50 to-emerald-50",
    shadowClass: "shadow-[0_8px_32px_-4px_rgba(16,185,129,0.28)]",
    textGradient: "from-green-600 to-emerald-600",
  },
  {
    emoji: "🌟",
    label: "Nintendo",
    sublabel: "Dès 2 890 MAD",
    iconGradient: "from-red-500 to-orange-500",
    cardBg: "bg-gradient-to-br from-red-50 to-orange-50",
    shadowClass: "shadow-[0_8px_32px_-4px_rgba(239,68,68,0.25)]",
    textGradient: "from-red-500 to-orange-500",
  },
  {
    emoji: "✨",
    label: "Occasion",
    sublabel: "Jusqu'à −50%",
    iconGradient: "from-cyan-500 to-blue-500",
    cardBg: "bg-gradient-to-br from-cyan-50 to-blue-50",
    shadowClass: "shadow-[0_8px_32px_-4px_rgba(6,182,212,0.28)]",
    textGradient: "from-cyan-600 to-blue-600",
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[92svh] flex flex-col justify-center px-4 py-12 md:py-16 overflow-hidden">
      {/* Decorative blobs — constrained so they don't overflow horizontally */}
      <div className="blob w-[420px] h-[420px] bg-blue-400 -top-20 -right-20" />
      <div className="blob w-72 h-72 bg-violet-400 bottom-16 -left-10" />
      <div className="blob w-56 h-56 bg-cyan-300 top-1/2 right-[12%]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-center">

          {/* ── Left column: copy ── */}
          <div className="flex flex-col gap-5">
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
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
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight text-slate-900"
            >
              L&apos;Univers du{" "}
              <span className="gradient-text">Gaming</span>
              <br />
              au Maroc
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-base md:text-lg text-slate-500 leading-relaxed max-w-md"
            >
              Consoles neuves &amp; d&apos;occasion, jeux &amp; accessoires.
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
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white btn-glow transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                Explorer le catalogue
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/item"
                className="inline-flex items-center gap-2 rounded-full border-2 border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                🔄 Voir l&apos;occasion
              </Link>
            </motion.div>

            {/* Trust micro-pills */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-2"
            >
              {["✅ Livraison rapide", "💳 Paiement à la livraison", "🔁 Retour facile"].map(
                (t) => (
                  <span
                    key={t}
                    className="rounded-full border border-slate-100 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm"
                  >
                    {t}
                  </span>
                )
              )}
            </motion.div>
          </div>

          {/* ── Right column: 2×2 card grid ── */}
          {/*
            grid-cols-2 + equal gap on both axes → all 4 cells are identical size.
            The stagger offset (odd cards slightly lower) creates intentional asymmetry
            without breaking the grid alignment.
          */}
          <div className="grid grid-cols-2 gap-4">
            {GAME_CARDS.map((card, i) => (
              <motion.div
                key={card.label}
                custom={i}
                variants={floatCards}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -8, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                // Alternating vertical offset for the "staircase" hero feel
                className={i % 2 === 0 ? "mt-0" : "mt-6"}
              >
                <div
                  className={`
                    ${card.cardBg} ${card.shadowClass}
                    rounded-3xl p-5 flex flex-col gap-3
                    border border-white/60
                    cursor-pointer
                  `}
                >
                  {/* Icon pill */}
                  <div
                    className={`
                      h-12 w-12 rounded-2xl flex items-center justify-center
                      bg-gradient-to-br ${card.iconGradient}
                      shadow-md
                    `}
                  >
                    <span className="text-2xl leading-none">{card.emoji}</span>
                  </div>

                  {/* Text */}
                  <div>
                    <p className="font-bold text-slate-800 text-sm leading-tight">{card.label}</p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{card.sublabel}</p>
                  </div>

                  {/* Inline link */}
                  <span
                    className={`
                      inline-flex items-center gap-1 text-xs font-bold
                      bg-gradient-to-r ${card.textGradient} bg-clip-text text-transparent
                    `}
                  >
                    Voir les offres <ArrowRight className="h-3 w-3 text-current opacity-70" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue — mobile only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 md:hidden"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="h-5 w-3 rounded-full border-2 border-slate-300 flex items-start justify-center pt-0.5"
        >
          <div className="h-1 w-0.5 rounded-full bg-slate-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}

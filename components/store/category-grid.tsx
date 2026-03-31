"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/*
  Layout: 4-column grid on desktop.
  Row 1: PlayStation (col-span-2) | Xbox (col-span-1) | Nintendo (col-span-1)
  Row 2: Jeux (col-span-1)        | Occasion (col-span-2) | Accessoires (col-span-1)

  All tiles share the SAME height via a fixed min-h so rows are visually balanced.
  Gaps are identical on x & y (gap-4).
  Colored shadow on each tile matches its gradient → Claymorphism glow.
*/

const CATEGORIES = [
  {
    label: "PlayStation",
    sublabel: "PS4 · PS5 · Accessoires",
    emoji: "🎮",
    href: "/p?platform=PlayStation",
    gradient: "from-blue-500 to-indigo-700",
    shadow: "shadow-[0_8px_28px_-4px_rgba(99,102,241,0.40)]",
    span: "md:col-span-2",
  },
  {
    label: "Xbox",
    sublabel: "Series X · Series S",
    emoji: "🟢",
    href: "/p?platform=Xbox",
    gradient: "from-green-500 to-emerald-700",
    shadow: "shadow-[0_8px_28px_-4px_rgba(16,185,129,0.38)]",
    span: "md:col-span-1",
  },
  {
    label: "Nintendo",
    sublabel: "Switch · OLED · Lite",
    emoji: "🔴",
    href: "/p?platform=Nintendo",
    gradient: "from-red-500 to-rose-700",
    shadow: "shadow-[0_8px_28px_-4px_rgba(239,68,68,0.35)]",
    span: "md:col-span-1",
  },
  {
    label: "Jeux Vidéo",
    sublabel: "Tous les titres",
    emoji: "🕹️",
    href: "/p?platform=Jeux",
    gradient: "from-violet-500 to-purple-700",
    shadow: "shadow-[0_8px_28px_-4px_rgba(139,92,246,0.38)]",
    span: "md:col-span-1",
  },
  {
    label: "Occasion",
    sublabel: "Testé · Certifié · Garanti",
    emoji: "✨",
    href: "/item",
    gradient: "from-cyan-500 to-teal-700",
    shadow: "shadow-[0_8px_28px_-4px_rgba(6,182,212,0.38)]",
    span: "md:col-span-2",
  },
  {
    label: "Accessoires",
    sublabel: "Manettes · Casques",
    emoji: "🎧",
    href: "/p?platform=Accessoire",
    gradient: "from-orange-400 to-amber-600",
    shadow: "shadow-[0_8px_28px_-4px_rgba(251,146,60,0.38)]",
    span: "md:col-span-1",
  },
];

export function CategoryGrid() {
  return (
    <section className="px-4 py-10 md:py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mb-7"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Nos Catégories
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Trouvez exactement ce que vous cherchez
          </p>
        </motion.div>

        {/*
          grid-cols-2 mobile / grid-cols-4 desktop.
          gap-4 is uniform in both directions — no gap-x / gap-y discrepancy.
          All tiles use the same min-h so rows align perfectly.
        */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              whileHover={{ y: -6, scale: 1.03 }}
              className={cat.span}
            >
              <Link href={cat.href} className="block h-full">
                <div
                  className={`
                    relative overflow-hidden rounded-3xl
                    bg-gradient-to-br ${cat.gradient}
                    ${cat.shadow}
                    min-h-[130px] h-full
                    p-5 flex flex-col justify-between
                    cursor-pointer select-none
                    border border-white/20
                    transition-transform duration-200
                  `}
                >
                  {/* Decorative circles — contained inside card */}
                  <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10" />
                  <div className="pointer-events-none absolute -right-2 -bottom-6 h-16 w-16 rounded-full bg-white/10" />

                  <span className="relative z-10 text-3xl leading-none">{cat.emoji}</span>

                  <div className="relative z-10 mt-3">
                    <p className="font-extrabold text-white text-[15px] leading-tight">
                      {cat.label}
                    </p>
                    <p className="mt-0.5 text-white/65 text-xs font-medium">
                      {cat.sublabel}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

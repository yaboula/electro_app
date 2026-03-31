"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORIES = [
  {
    label: "PlayStation",
    sublabel: "PS4 · PS5",
    emoji: "🎮",
    href: "/p?platform=PlayStation",
    gradient: "from-blue-600 to-blue-800",
    colSpan: "md:col-span-2",
    size: "large",
  },
  {
    label: "Xbox",
    sublabel: "Series X · Series S",
    emoji: "🟢",
    href: "/p?platform=Xbox",
    gradient: "from-green-500 to-green-700",
    colSpan: "",
    size: "normal",
  },
  {
    label: "Nintendo",
    sublabel: "Switch · Switch OLED",
    emoji: "🔴",
    href: "/p?platform=Nintendo",
    gradient: "from-red-500 to-rose-600",
    colSpan: "",
    size: "normal",
  },
  {
    label: "Jeux",
    sublabel: "Tous les titres",
    emoji: "🕹️",
    href: "/p?platform=Jeux",
    gradient: "from-violet-500 to-purple-700",
    colSpan: "",
    size: "normal",
  },
  {
    label: "Occasion",
    sublabel: "Testé · Certifié",
    emoji: "✨",
    href: "/item",
    gradient: "from-cyan-500 to-teal-600",
    colSpan: "md:col-span-2",
    size: "large",
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
          transition={{ duration: 0.5 }}
          className="mb-7"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Nos Catégories
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Trouvez exactement ce que vous cherchez
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5, scale: 1.03 }}
              className={cat.colSpan}
            >
              <Link href={cat.href}>
                <div
                  className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.gradient} p-5 cursor-pointer ${
                    cat.size === "large" ? "min-h-[140px]" : "min-h-[120px]"
                  } flex flex-col justify-between shadow-lg`}
                >
                  {/* Decorative circle */}
                  <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10" />
                  <div className="absolute -right-2 -bottom-8 h-20 w-20 rounded-full bg-white/10" />

                  <span className="text-3xl relative z-10">{cat.emoji}</span>
                  <div className="relative z-10">
                    <p className="font-extrabold text-white text-base leading-tight">
                      {cat.label}
                    </p>
                    <p className="text-white/70 text-xs font-medium mt-0.5">
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

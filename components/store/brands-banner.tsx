"use client";

import { motion } from "framer-motion";

/* Brand logos as SVG/text pills — no external image deps */
const BRANDS = [
  { name: "PlayStation", color: "#003087", bg: "bg-[#003087]", text: "text-white" },
  { name: "Xbox",        color: "#107C10", bg: "bg-[#107C10]", text: "text-white" },
  { name: "Nintendo",   color: "#E4000F", bg: "bg-[#E4000F]", text: "text-white" },
  { name: "EA Sports",  color: "#1a1a2e", bg: "bg-slate-900",  text: "text-white" },
  { name: "Ubisoft",    color: "#0040FF", bg: "bg-blue-600",   text: "text-white" },
  { name: "Activision", color: "#1a1a1a", bg: "bg-slate-800",  text: "text-white" },
  { name: "Rockstar",   color: "#fbbf24", bg: "bg-amber-400",  text: "text-slate-900" },
  { name: "Capcom",     color: "#2563eb", bg: "bg-blue-700",   text: "text-white" },
];

export function BrandsBanner() {
  return (
    <section className="px-4 py-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-5 text-center text-sm font-semibold text-slate-400 uppercase tracking-widest"
        >
          Marques officielles disponibles
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {BRANDS.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ opacity: 0, scale: 0.88 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              whileHover={{ scale: 1.08, y: -2 }}
              className={`${b.bg} ${b.text} rounded-2xl px-6 py-3 font-extrabold text-sm tracking-tight cursor-pointer shadow-sm transition-shadow hover:shadow-md`}
            >
              {b.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

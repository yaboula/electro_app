"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Star } from "lucide-react";

const USED_ITEMS = [
  {
    id: "u1",
    name: "PS5 Standard — Grade A",
    price: 4_990,
    original: 6_490,
    grade: "A",
    gradeColor: "bg-green-500",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "u2",
    name: "Xbox Series X — Grade B",
    price: 3_800,
    original: 5_200,
    grade: "B",
    gradeColor: "bg-blue-500",
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=400&q=80&auto=format&fit=crop",
  },
  {
    id: "u3",
    name: "Nintendo Switch — Grade A",
    price: 2_490,
    original: 3_490,
    grade: "A",
    gradeColor: "bg-green-500",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400&q=80&auto=format&fit=crop",
  },
];

export function UsedSection() {
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-blue-950 shadow-2xl">
          {/* Top pattern */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-violet-600/20 blur-2xl" />
            </div>

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-6 md:px-10 pt-8 pb-6 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-3">
                  ✨ Certifié ELECTRO.ma
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                  Produits d&apos;Occasion
                  <br />
                  <span className="text-cyan-400">Testés &amp; Garantis</span>
                </h2>
                <p className="mt-2 text-white/60 text-sm max-w-md">
                  Chaque article d&apos;occasion est inspecté, nettoyé et testé par nos techniciens.
                  Grade A = comme neuf. Grade B = très bon état.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  "Inspection technique complète",
                  "Nettoyage professionnel",
                  "Garantie 3 mois incluse",
                  "Paiement à la livraison",
                ].map((t) => (
                  <div key={t} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    <span className="text-white/80 text-sm font-medium">{t}</span>
                  </div>
                ))}
                <Link href="/item"
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-colors">
                  Voir l&apos;occasion <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Used product cards */}
            <div className="relative z-10 grid grid-cols-1 gap-4 p-6 md:p-10 md:grid-cols-3">
              {USED_ITEMS.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.45 }}
                  whileHover={{ y: -4 }}
                >
                  <Link href="/item" className="block">
                    <div className="rounded-2xl bg-white/8 border border-white/12 overflow-hidden hover:bg-white/12 transition-colors cursor-pointer">
                      <div className="relative">
                        <Image
                          src={item.img}
                          alt={item.name}
                          width={400}
                          height={250}
                          className="w-full aspect-[4/3] object-cover"
                        />
                        <span className={`absolute left-3 top-3 ${item.gradeColor} rounded-full px-3 py-1 text-xs font-extrabold text-white shadow-md`}>
                          Grade {item.grade}
                        </span>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                      </div>

                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                          <span className="text-[11px] font-semibold text-green-400">Certifié</span>
                        </div>
                        <p className="font-bold text-white text-sm line-clamp-1">{item.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] text-white/70">{item.rating}</span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="font-extrabold text-white text-base">
                            {item.price.toLocaleString("fr-MA")} MAD
                          </span>
                          <span className="text-xs text-white/40 line-through">
                            {item.original.toLocaleString("fr-MA")}
                          </span>
                        </div>
                        <button className="mt-3 w-full rounded-full border border-white/20 bg-white/10 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors">
                          Voir le détail →
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

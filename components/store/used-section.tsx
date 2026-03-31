"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const USED = [
  {
    name: "PS4 Pro 1To",
    img: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&q=80",
    grade: "Grade A",
    gradeColor: "bg-emerald-500 text-white",
    price: 1799,
    was: 2400,
    rating: 4.8,
    reviews: 32,
    condition: "Très bon état, complet avec câbles et manette",
    shadow: "shadow-emerald-500/20",
  },
  {
    name: "Xbox One X",
    img: "https://images.unsplash.com/photo-1601089895733-e8c7c9a2df02?w=400&q=80",
    grade: "Grade B",
    gradeColor: "bg-amber-500 text-white",
    price: 1299,
    was: 1900,
    rating: 4.5,
    reviews: 18,
    condition: "Bon état, quelques légères rayures cosmétiques",
    shadow: "shadow-amber-500/20",
  },
  {
    name: "Nintendo Switch V2",
    img: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&q=80",
    grade: "Grade A",
    gradeColor: "bg-emerald-500 text-white",
    price: 1599,
    was: 2100,
    rating: 4.9,
    reviews: 47,
    condition: "Excellent état, boîte d'origine incluse",
    shadow: "shadow-sky-500/20",
  },
];

const WA_BASE = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

const CERTS = [
  "Testé et inspecté par nos techniciens",
  "Nettoyé, réinitialisé aux paramètres usine",
  "Garantie 3 mois incluse",
  "Remboursement si non conforme à la description",
];

export function UsedSection() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-7xl rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-8 md:p-12 shadow-2xl shadow-indigo-900/30">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">Seconde main</p>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Occasion certifié
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                Testés &amp; Garantis
              </span>
            </h2>
          </div>
          {/* Certifications */}
          <div className="flex flex-col gap-2">
            {CERTS.map((c) => (
              <div key={c} className="flex items-start gap-2">
                <BadgeCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-white/70">{c}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {USED.map(({ name, img, grade, gradeColor, price, was, rating, reviews, condition, shadow }, i) => {
            const pct = Math.round((1 - price / was) * 100);
            const waMsg = `Bonjour, je suis intéressé par ${name} (occasion ${grade}) à ${price} MAD`;
            return (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className={`bg-white rounded-3xl shadow-2xl ${shadow} overflow-hidden flex flex-col`}
              >
                {/* Image */}
                <div className="relative h-44 overflow-hidden">
                  <Image src={img} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${gradeColor} shadow-md`}>{grade}</span>
                    <span className="rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-black text-white shadow-md">-{pct}%</span>
                  </div>
                  {/* Certified badge */}
                  <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 p-4 flex-1">
                  <p className="text-sm font-black text-slate-900">{name}</p>
                  <p className="text-xs text-slate-500 line-clamp-2">{condition}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-600">{rating}</span>
                    <span className="text-xs text-slate-400">({reviews} avis)</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-auto">
                    <span className="text-lg font-black text-indigo-700">{price.toLocaleString()} MAD</span>
                    <span className="text-xs text-slate-400 line-through">{was.toLocaleString()}</span>
                  </div>
                  <a
                    href={`${WA_BASE}?text=${encodeURIComponent(waMsg)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="clay-btn-green mt-1 flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-xs font-black text-white"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Commander Occasion
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center">
          <Link href="/item"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-8 py-3.5 text-sm font-black text-white backdrop-blur-sm hover:bg-white/20 transition-all">
            Voir tous les produits occasion
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

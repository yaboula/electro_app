"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATS = [
  {
    label: "PlayStation",
    sub: "PS4 · PS5 · VR",
    href: "/p?platform=PlayStation",
    img: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&q=80",
    gradient: "from-blue-600/75 to-indigo-900/80",
    span: "md:col-span-2 md:row-span-2",
    height: "h-[280px] md:h-full",
  },
  {
    label: "Xbox",
    sub: "Series X/S · One",
    href: "/p?platform=Xbox",
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=80",
    gradient: "from-green-700/75 to-teal-900/80",
    span: "",
    height: "h-[160px]",
  },
  {
    label: "Nintendo",
    sub: "Switch · OLED",
    href: "/p?platform=Nintendo",
    img: "https://images.unsplash.com/photo-1598246964989-7bba3a3d7c7e?w=500&q=80",
    gradient: "from-red-600/75 to-rose-900/80",
    span: "",
    height: "h-[160px]",
  },
  {
    label: "Jeux Vidéo",
    sub: "Toutes plateformes",
    href: "/p?platform=Jeux",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80",
    gradient: "from-violet-600/75 to-purple-900/80",
    span: "",
    height: "h-[160px]",
  },
  {
    label: "Accessoires",
    sub: "Manettes · Casques",
    href: "/p?platform=Accessoire",
    img: "https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=500&q=80",
    gradient: "from-orange-600/75 to-amber-900/80",
    span: "",
    height: "h-[160px]",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-7xl">
        {/* Section title */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">Catalogue</p>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Nos catégories</h2>
          </div>
          <Link href="/p" className="hidden md:flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-4">
          {CATS.map(({ label, sub, href, img, gradient, span, height }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.07, duration: 0.45, ease: "easeOut" }}
              className={span}
            >
              <Link href={href} className={`group relative flex overflow-hidden rounded-3xl ${height} shadow-xl shadow-slate-900/15`}>
                <Image
                  src={img}
                  alt={label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${gradient}`} />
                <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="text-lg font-black text-white leading-tight">{label}</p>
                    <p className="text-xs font-semibold text-white/75">{sub}</p>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all group-hover:bg-white group-hover:text-slate-900">
                    <ArrowRight className="h-4 w-4" />
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

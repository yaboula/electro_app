"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    label: "PlayStation",
    sublabel: "PS4 · PS5 · Accessoires",
    href: "/p?platform=PlayStation",
    img: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500&q=75&auto=format&fit=crop",
    gradient: "from-blue-900/70 to-blue-600/40",
    accent: "bg-blue-600",
    span: "md:col-span-2 md:row-span-2",
    tall: true,
  },
  {
    label: "Xbox",
    sublabel: "Series X · Series S",
    href: "/p?platform=Xbox",
    img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500&q=75&auto=format&fit=crop",
    gradient: "from-green-900/70 to-green-600/40",
    accent: "bg-green-600",
    span: "",
    tall: false,
  },
  {
    label: "Nintendo",
    sublabel: "Switch · OLED",
    href: "/p?platform=Nintendo",
    img: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=75&auto=format&fit=crop",
    gradient: "from-red-900/70 to-red-600/40",
    accent: "bg-red-500",
    span: "",
    tall: false,
  },
  {
    label: "Jeux Vidéo",
    sublabel: "Tous les titres",
    href: "/p?platform=Jeux",
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=75&auto=format&fit=crop",
    gradient: "from-violet-900/70 to-violet-600/40",
    accent: "bg-violet-600",
    span: "",
    tall: false,
  },
  {
    label: "Accessoires",
    sublabel: "Manettes · Casques · Câbles",
    href: "/p?platform=Accessoire",
    img: "https://images.unsplash.com/photo-1592840062661-a5a7f78e2056?w=500&q=75&auto=format&fit=crop",
    gradient: "from-orange-900/70 to-orange-600/40",
    accent: "bg-orange-500",
    span: "",
    tall: false,
  },
];

export function CategoryGrid() {
  return (
    <section className="px-4 py-10 md:py-14">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="mb-7 flex items-end justify-between"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              🎯 Nos Catégories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Trouvez exactement ce que vous cherchez
            </p>
          </div>
          <Link href="/p"
            className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors">
            Tout voir <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[180px]">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.08, duration: 0.45, ease: "easeOut" }}
              whileHover={{ scale: 1.025 }}
              className={`${cat.span} ${cat.tall ? "row-span-2" : ""}`}
            >
              <Link href={cat.href} className="block h-full w-full">
                <div className="relative h-full w-full overflow-hidden rounded-3xl shadow-lg group cursor-pointer">
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                    <span className={`mb-2 self-start ${cat.accent} rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white`}>
                      Explorer →
                    </span>
                    <p className="font-extrabold text-white text-base md:text-lg leading-tight drop-shadow">
                      {cat.label}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5 font-medium">{cat.sublabel}</p>
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

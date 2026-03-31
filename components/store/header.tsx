"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Search, Zap, ShoppingCart, Heart, User, ChevronDown,
  Menu, X, Phone, Tag, Truck,
} from "lucide-react";

const CATEGORIES = [
  { label: "PlayStation", href: "/p?platform=PlayStation", emoji: "🎮" },
  { label: "Xbox",         href: "/p?platform=Xbox",         emoji: "🟢" },
  { label: "Nintendo",     href: "/p?platform=Nintendo",     emoji: "🔴" },
  { label: "Jeux Vidéo",  href: "/p?platform=Jeux",         emoji: "🕹️" },
  { label: "Accessoires",  href: "/p?platform=Accessoire",   emoji: "🎧" },
  { label: "Occasion",     href: "/item",                    emoji: "✨" },
];

const WA_PATH = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

export function Header() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [catOpen, setCatOpen]         = useState(false);
  const [searchVal, setSearchVal]     = useState("");
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchVal.trim())
      window.location.href = `/search?q=${encodeURIComponent(searchVal.trim())}`;
  };

  return (
    <>
      {/* ── Promo top bar ── */}
      <div className="promo-bar hidden md:flex items-center justify-center gap-6 py-2 text-xs text-white/90 font-medium">
        <span className="flex items-center gap-1.5">
          <Truck className="h-3.5 w-3.5" />
          Livraison gratuite dès 500 MAD
        </span>
        <span className="text-white/40">·</span>
        <span className="flex items-center gap-1.5">
          <Tag className="h-3.5 w-3.5" />
          Paiement à la livraison partout au Maroc
        </span>
        <span className="text-white/40">·</span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" />
          Support WhatsApp 7j/7
        </span>
      </div>

      {/* ── Main header ── */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-header shadow-md shadow-blue-500/8" : "bg-white"
        }`}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        {/* Desktop row */}
        <div className="hidden md:block border-b border-slate-100/80">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-md shadow-blue-500/30">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
              <div className="leading-none">
                <p className="text-[17px] font-extrabold gradient-text tracking-tight">ELECTRO.ma</p>
                <p className="text-[10px] text-slate-400 font-medium">Gaming & Tech</p>
              </div>
            </Link>

            {/* Categories dropdown */}
            <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors shrink-0">
                <Tag className="h-3.5 w-3.5" />
                Catégories
                <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-2 w-56 rounded-2xl bg-white shadow-xl shadow-blue-500/12 border border-slate-100 overflow-hidden z-50"
                  >
                    {CATEGORIES.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                      >
                        <span className="text-lg">{c.emoji}</span>
                        {c.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search bar — wide */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Rechercher une console, un jeu, un accessoire..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:bg-white focus:shadow-md focus:shadow-blue-500/10 transition-all"
              />
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Heart className="h-5 w-5" />
                <span className="text-[9px] font-semibold">Favoris</span>
              </button>
              <button className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <User className="h-5 w-5" />
                <span className="text-[9px] font-semibold">Compte</span>
              </button>
              <button className="relative flex flex-col items-center gap-0.5 p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[9px] font-semibold">Panier</span>
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white">0</span>
              </button>

              {/* WhatsApp */}
              <a
                href={WA_PATH}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-bold text-white btn-whatsapp"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Commander
              </a>
            </div>
          </div>

          {/* Nav pills row */}
          <div className="mx-auto flex max-w-7xl items-center gap-1 px-6 pb-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  pathname.startsWith(c.href.split("?")[0]) && c.href !== "/"
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                    : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                }`}
              >
                <span>{c.emoji}</span>
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Mobile header ── */}
        <div className="md:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
                <Zap className="h-4 w-4 fill-white text-white" />
              </div>
              <span className="text-base font-extrabold gradient-text">ELECTRO.ma</span>
            </Link>

            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="search"
                placeholder="Rechercher..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:bg-white transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = (e.target as HTMLInputElement).value.trim();
                    if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <a href={WA_PATH} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shadow-md shadow-green-500/30">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile category strip */}
          <div className="scroll-x flex gap-2 px-4 pb-3">
            {CATEGORIES.map((c) => (
              <Link key={c.href} href={c.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-blue-300 hover:text-blue-700 transition-colors">
                <span>{c.emoji}</span>{c.label}
              </Link>
            ))}
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden border-t border-slate-100 bg-white"
              >
                <div className="flex flex-col gap-1 px-4 py-3">
                  {CATEGORIES.map((c) => (
                    <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                      <span className="text-lg">{c.emoji}</span>{c.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}

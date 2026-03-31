"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  Search, Zap, ShoppingCart, Heart, User,
  ChevronDown, Menu, X, Truck, Tag, Phone,
} from "lucide-react";

const NAV = [
  { label: "PlayStation", href: "/p?platform=PlayStation" },
  { label: "Xbox",         href: "/p?platform=Xbox" },
  { label: "Nintendo",    href: "/p?platform=Nintendo" },
  { label: "Jeux Vidéo", href: "/p?platform=Jeux" },
  { label: "Accessoires", href: "/p?platform=Accessoire" },
  { label: "Occasion",    href: "/item" },
];

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

export function Header() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen]       = useState(false);
  const [q, setQ]                   = useState("");
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  const search = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && q.trim())
      window.location.href = `/search?q=${encodeURIComponent(q.trim())}`;
  };

  return (
    <>
      {/* ── Promo bar ── */}
      <div className="promo-bar hidden md:flex items-center justify-center gap-8 py-2.5 text-xs font-semibold text-white/90">
        <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" />Livraison gratuite dès 500 MAD</span>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" />Paiement à la livraison partout au Maroc</span>
        <span className="opacity-30">|</span>
        <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />Support WhatsApp 7j/7</span>
      </div>

      {/* ── Main header ── */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "glass-header shadow-lg shadow-indigo-500/8" : "bg-white/90 backdrop-blur-sm"}`}>

        {/* Desktop primary row */}
        <div className="hidden md:block border-b border-slate-100/60">
          <div className="mx-auto flex max-w-7xl items-center gap-5 px-6 py-3.5">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/30">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
              <div className="leading-none">
                <p className="text-[17px] font-black tracking-tight text-slate-900">ELECTRO<span className="text-indigo-600">.ma</span></p>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">Gaming & Tech</p>
              </div>
            </Link>

            {/* Categories dropdown */}
            <div className="relative shrink-0" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
              <button className="flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white clay-btn">
                Catégories
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.16 }}
                    className="absolute left-0 top-full mt-2 w-52 rounded-2xl bg-white shadow-2xl shadow-indigo-500/15 border border-slate-100/80 overflow-hidden z-50"
                  >
                    {NAV.map((c) => (
                      <Link key={c.href} href={c.href}
                        className="block px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-b border-slate-50 last:border-0">
                        {c.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={search}
                type="search"
                placeholder="Rechercher une console, un jeu, un accessoire..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:bg-white focus:shadow-md focus:shadow-indigo-500/10 transition-all"
              />
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { icon: Heart, label: "Favoris" },
                { icon: User,  label: "Compte" },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex flex-col items-center gap-0.5 p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                  <Icon className="h-5 w-5" />
                  <span className="text-[9px] font-bold tracking-wide">{label}</span>
                </button>
              ))}
              <button className="relative flex flex-col items-center gap-0.5 p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[9px] font-bold tracking-wide">Panier</span>
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">0</span>
              </button>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="ml-2 flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-bold text-white clay-btn-green">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Commander
              </a>
            </div>
          </div>

          {/* Nav pills */}
          <div className="mx-auto flex max-w-7xl gap-1 px-6 pb-2.5">
            {NAV.map((c) => {
              const active = c.href !== "/" && pathname.startsWith(c.href.split("?")[0]);
              return (
                <Link key={c.href} href={c.href}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                    active
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/30"
                      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}>
                  {c.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Mobile header ── */}
        <div className="md:hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600">
                <Zap className="h-4 w-4 fill-white text-white" />
              </div>
              <span className="text-base font-black text-slate-900">ELECTRO<span className="text-indigo-600">.ma</span></span>
            </Link>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input type="search" placeholder="Rechercher..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = (e.target as HTMLInputElement).value.trim();
                    if (val) window.location.href = `/search?q=${encodeURIComponent(val)}`;
                  }
                }}
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500 shadow-md shadow-green-500/30">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav strip */}
          <div className="scroll-x flex gap-2 px-4 pb-3">
            {NAV.map((c) => (
              <Link key={c.href} href={c.href}
                className="shrink-0 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-sm hover:border-indigo-300 hover:text-indigo-700 transition-colors">
                {c.label}
              </Link>
            ))}
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-slate-100 bg-white"
              >
                <div className="flex flex-col gap-1 px-4 py-3">
                  {NAV.map((c) => (
                    <Link key={c.href} href={c.href} onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                      {c.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
}

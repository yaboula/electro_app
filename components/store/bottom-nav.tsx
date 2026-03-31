"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid3x3, Archive, Search, MessageCircle } from "lucide-react";

const TABS = [
  { label: "Accueil",  href: "/",     icon: Home },
  { label: "Catalogue", href: "/p",   icon: Grid3x3 },
  { label: "Occasion", href: "/item", icon: Archive },
  { label: "Recherche", href: "/search", icon: Search },
];

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* WhatsApp floating pill */}
      <div className="flex justify-center pb-1 pt-2">
        <a href={WA} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-green-500 px-5 py-2 text-xs font-black text-white shadow-lg shadow-green-500/40 active:scale-95 transition-transform">
          <MessageCircle className="h-4 w-4" />
          Commander via WhatsApp
        </a>
      </div>

      {/* Tab bar */}
      <div className="mx-3 mb-3 flex items-center justify-around rounded-2xl bg-white/90 backdrop-blur-xl px-2 py-2 shadow-xl shadow-slate-900/12 border border-slate-100">
        {TABS.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link key={href} href={href}
              className={`relative flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${
                active ? "text-indigo-600" : "text-slate-400"
              }`}>
              {active && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 rounded-xl bg-indigo-50"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <Icon className="relative z-10 h-5 w-5" />
              <span className={`relative z-10 text-[10px] font-bold ${active ? "text-indigo-600" : "text-slate-400"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

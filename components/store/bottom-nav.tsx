"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Grid3X3, RefreshCw, Search, MessageCircle } from "lucide-react";

const NAV = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Catalogue", href: "/p", icon: Grid3X3 },
  { label: "Occasion", href: "/item", icon: RefreshCw },
  { label: "Recherche", href: "/search", icon: Search },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Safe area padding for iOS */}
      <div
        className="bg-white/90 backdrop-blur-2xl border-t border-slate-200/60"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around px-2 pt-1 pb-2">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link key={href} href={href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  className="flex flex-col items-center gap-0.5 py-1"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200 ${
                      active
                        ? "bg-blue-600 shadow-lg shadow-blue-500/35"
                        : "bg-transparent"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors ${
                        active ? "text-white" : "text-slate-500"
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-semibold transition-colors ${
                      active ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {label}
                  </span>
                </motion.div>
              </Link>
            );
          })}

          {/* WhatsApp pill CTA */}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <motion.div
              whileTap={{ scale: 0.85 }}
              className="flex flex-col items-center gap-0.5 py-1"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-500 shadow-lg shadow-green-500/35">
                <MessageCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-semibold text-green-600">WhatsApp</span>
            </motion.div>
          </a>
        </div>
      </div>
    </nav>
  );
}

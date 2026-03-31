import Link from "next/link";
import { Zap, MapPin, Phone, Mail } from "lucide-react";

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

const LINKS = {
  Catalogue: [
    { label: "PlayStation", href: "/p?platform=PlayStation" },
    { label: "Xbox",        href: "/p?platform=Xbox" },
    { label: "Nintendo",   href: "/p?platform=Nintendo" },
    { label: "Jeux Vidéo", href: "/p?platform=Jeux" },
    { label: "Accessoires", href: "/p?platform=Accessoire" },
  ],
  Occasion: [
    { label: "Voir l'occasion", href: "/item" },
    { label: "Grade A",         href: "/item?grade=USADO_A" },
    { label: "Grade B",         href: "/item?grade=USADO_B" },
  ],
  Infos: [
    { label: "À propos",         href: "#" },
    { label: "Comment commander", href: "#" },
    { label: "Livraison & Retours", href: "#" },
    { label: "FAQ",              href: "#" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-8">
      {/* WhatsApp CTA strip */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-4 text-center">
        <p className="text-white font-semibold text-sm">
          Des questions ? Contactez-nous directement sur{" "}
          <a href={WA} target="_blank" rel="noopener noreferrer"
            className="underline font-bold hover:text-green-100 transition-colors">
            WhatsApp →
          </a>
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
              <span className="text-lg font-extrabold text-slate-900">ELECTRO.ma</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Votre destination gaming au Maroc. Consoles, jeux et accessoires neufs et d'occasion.
              Paiement à la livraison partout au Maroc.
            </p>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                Casablanca, Maroc
              </span>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-green-600 transition-colors">
                <Phone className="h-4 w-4 text-green-600 shrink-0" />
                WhatsApp: +212 6XX XXX XXX
              </a>
              <span className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 shrink-0" />
                contact@electro.ma
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <p className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">{title}</p>
              {links.map((l) => (
                <Link key={l.href} href={l.href}
                  className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-6">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} ELECTRO.ma — Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span>🇲🇦 Maroc</span>
            <span>·</span>
            <span>Paiement à la livraison</span>
            <span>·</span>
            <span>Livraison 24–48h</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

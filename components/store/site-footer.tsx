import Link from "next/link";
import { Zap, MapPin, Phone, Mail } from "lucide-react";

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`;

const LINKS = {
  Catalogue: [
    { label: "PlayStation",  href: "/p?platform=PlayStation" },
    { label: "Xbox",          href: "/p?platform=Xbox" },
    { label: "Nintendo",     href: "/p?platform=Nintendo" },
    { label: "Jeux Vidéo",  href: "/p?platform=Jeux" },
    { label: "Accessoires",  href: "/p?platform=Accessoire" },
  ],
  Occasion: [
    { label: "Tous les articles",  href: "/item" },
    { label: "Grade A",            href: "/item?condition=USADO_A" },
    { label: "Grade B",            href: "/item?condition=USADO_B" },
  ],
  Infos: [
    { label: "À propos",           href: "/about" },
    { label: "Livraison & retour", href: "/livraison" },
    { label: "Contact",            href: "/contact" },
    { label: "FAQ",                href: "/faq" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-white">
      {/* WA CTA strip */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-base font-black text-white">Une question ? Contactez-nous sur WhatsApp</p>
            <p className="text-sm text-green-100/80">Réponse en moins de 5 minutes, 7j/7</p>
          </div>
          <a href={WA} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-black text-green-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-green-600 shrink-0">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Ouvrir WhatsApp
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand col */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
              <div>
                <p className="text-lg font-black text-white">ELECTRO<span className="text-indigo-400">.ma</span></p>
                <p className="text-xs text-slate-400 font-medium">Gaming & Tech Maroc</p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-5">
              Votre destination gaming au Maroc. Consoles, jeux et accessoires neufs &amp; occasion. Livraison partout au Maroc, paiement à la livraison.
            </p>
            <div className="flex flex-col gap-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-indigo-400 shrink-0" />Casablanca, Maroc</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-indigo-400 shrink-0" />+212 6 00 00 00 00</div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-indigo-400 shrink-0" />contact@electro.ma</div>
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(LINKS).map(([col, links]) => (
            <div key={col}>
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-indigo-400">{col}</h3>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ELECTRO.ma — Tous droits réservés</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-indigo-500" />Livraison COD</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-green-500" />Support 7j/7</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3 w-3 text-violet-500" />Garantie incluse</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

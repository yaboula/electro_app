"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const BRANDS = [
  { name: "PlayStation", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/240px-Playstation_logo_colour.svg.png", bg: "bg-[#003087]",  text: "text-white" },
  { name: "Xbox",        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/240px-Xbox_one_logo.svg.png",               bg: "bg-[#107C10]",  text: "text-white" },
  { name: "Nintendo",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/240px-Nintendo.svg.png",                          bg: "bg-[#E4000F]",  text: "text-white" },
  { name: "EA Sports",  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/EA_Sports_Logo.svg/240px-EA_Sports_Logo.svg.png",              bg: "bg-[#ff4747]",  text: "text-white" },
  { name: "Ubisoft",    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ubisoft_logo.svg/240px-Ubisoft_logo.svg.png",                  bg: "bg-slate-900",  text: "text-white" },
  { name: "Rockstar",   logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/240px-Rockstar_Games_Logo.svg.png",    bg: "bg-[#FCAF17]",  text: "text-slate-900" },
  { name: "Activision", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Activision.svg/240px-Activision.svg.png",                      bg: "bg-slate-800",  text: "text-white" },
  { name: "2K Games",   logo: null, bg: "bg-gradient-to-br from-indigo-600 to-violet-600", text: "text-white" },
];

export function BrandsBanner() {
  return (
    <section className="py-12 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">Partenaires officiels</p>
          <h2 className="text-3xl font-black text-slate-900">Marques disponibles</h2>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {BRANDS.map(({ name, logo, bg, text }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.35, ease: "easeOut" }}
              whileHover={{ y: -4, scale: 1.06 }}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl ${bg} p-4 h-20 shadow-lg cursor-pointer transition-shadow hover:shadow-xl`}
            >
              {logo ? (
                <div className="relative h-8 w-full">
                  <Image src={logo} alt={name} fill className="object-contain brightness-200" sizes="80px" />
                </div>
              ) : (
                <p className={`text-base font-black ${text} text-center leading-tight`}>{name}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

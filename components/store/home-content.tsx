"use client";

import { motion } from "framer-motion";
import {
  Gamepad2,
  Truck,
  ShieldCheck,
  Headset,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/store/product-card";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

const features = [
  {
    icon: Truck,
    title: "Livraison Partout",
    desc: "Partout au Maroc, paiement à la livraison",
  },
  {
    icon: ShieldCheck,
    title: "Qualité Garantie",
    desc: "Produits testés et vérifiés avant envoi",
  },
  {
    icon: Headset,
    title: "Support WhatsApp",
    desc: "Confirmation et suivi via WhatsApp",
  },
];

const categories = [
  {
    name: "PlayStation",
    platform: "PS5",
    emoji: "🎮",
    color: "from-blue-600/20 to-blue-800/20",
  },
  {
    name: "Xbox",
    platform: "Xbox Series",
    emoji: "🟢",
    color: "from-green-600/20 to-green-800/20",
  },
  {
    name: "Nintendo",
    platform: "Nintendo Switch",
    emoji: "🔴",
    color: "from-red-600/20 to-red-800/20",
  },
  {
    name: "PC Gaming",
    platform: "PC",
    emoji: "🖥️",
    color: "from-purple-600/20 to-purple-800/20",
  },
  {
    name: "Accessoires",
    platform: "Accessoire",
    emoji: "🎧",
    color: "from-orange-600/20 to-orange-800/20",
  },
  {
    name: "Occasions",
    platform: "",
    emoji: "♻️",
    color: "from-teal-600/20 to-teal-800/20",
  },
];

interface HomeContentProps {
  products: {
    id: string;
    title: string;
    slug: string;
    platform: string;
    main_image_url: string | null;
    min_price: number;
    has_used: boolean;
    active_items_count: number;
  }[];
}

export function HomeContent({ products }: HomeContentProps) {
  return (
    <div className="relative">
      {/* Ambient gradient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/8 blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-12 pb-16 md:px-6 md:pt-24 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center text-center"
          >
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
            >
              <Zap className="h-4 w-4" />
              Nouveau — Livraison Express Casablanca
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl md:leading-[1.1]"
            >
              Le Gaming{" "}
              <span className="bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent">
                Premium
              </span>{" "}
              au Maroc
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              Consoles, jeux et accessoires — neufs et d&apos;occasion.
              Paiement à la livraison partout au Maroc.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                size="lg"
                className="gap-2 text-base"
                render={<Link href="/p" />}
              >
                Explorer les Produits
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-base border-primary/20 hover:bg-primary/10"
                render={<Link href="/item" />}
              >
                <Gamepad2 className="h-4 w-4" />
                Voir les Occasions
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bento Categories Grid */}
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-2xl font-bold tracking-tight md:text-3xl"
          >
            Catégories
          </motion.h2>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 md:gap-4"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  href={
                    cat.platform
                      ? `/p?platform=${cat.platform}`
                      : "/item"
                  }
                  className="block"
                >
                  <Card className="group relative overflow-hidden border-white/5 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <CardContent className="flex flex-col items-center gap-3 p-6">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.color} text-2xl transition-transform group-hover:scale-110`}
                      >
                        {cat.emoji}
                      </div>
                      <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                        {cat.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="px-4 pb-16 md:px-6 md:pb-24">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-8 flex items-center justify-between"
            >
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Produits Populaires
              </h2>
              <Button
                variant="ghost"
                className="gap-1 text-muted-foreground"
                render={<Link href="/p" />}
              >
                Voir tout
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Bento */}
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid gap-4 md:grid-cols-3"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeInUp}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="border-white/5 bg-card/50 backdrop-blur-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <feat.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{feat.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {feat.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA WhatsApp Banner */}
      <section className="px-4 pb-16 md:px-6 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-purple-500/10">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:p-12">
                <h2 className="text-2xl font-bold md:text-3xl">
                  Une question ? Écrivez-nous !
                </h2>
                <p className="max-w-md text-muted-foreground">
                  Notre équipe est disponible sur WhatsApp pour vous aider à
                  choisir le produit idéal.
                </p>
                <Button
                  size="lg"
                  className="mt-2 gap-2 bg-green-600 text-white hover:bg-green-700"
                  render={
                    <a
                      href={`https://wa.me/${process.env.NEXT_PUBLIC_ADMIN_WHATSAPP ?? "212600000000"}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  💬 Contacter sur WhatsApp
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

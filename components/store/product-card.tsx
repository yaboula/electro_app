"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMAD, cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    platform: string;
    main_image_url: string | null;
    min_price: number;
    has_used: boolean;
    active_items_count: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/p/${product.slug}`}
        className={cn(
          "group block overflow-hidden rounded-xl border border-white/5",
          "bg-card/50 backdrop-blur-sm transition-all",
          "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.main_image_url ? (
            <Image
              src={product.main_image_url}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <Badge
            variant="secondary"
            className="absolute top-2.5 left-2.5 text-[10px] bg-background/80 backdrop-blur-sm"
          >
            {product.platform}
          </Badge>
          {product.has_used && (
            <Badge
              variant="outline"
              className="absolute top-2.5 right-2.5 text-[10px] border-amber-500/30 bg-amber-500/10 text-amber-400"
            >
              Occasion dispo
            </Badge>
          )}
        </div>

        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
            {product.title}
          </h3>
          <p className="mt-1.5 text-xs text-muted-foreground">
            À partir de
          </p>
          <p className="text-base font-bold text-primary">
            {formatMAD(product.min_price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

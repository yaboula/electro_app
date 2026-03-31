"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMAD, cn } from "@/lib/utils";

interface UsedItemCardProps {
  item: {
    id: string;
    condition: string;
    serial_number: string | null;
    price: number;
    product: {
      title: string;
      platform: string;
      main_image_url: string | null;
    } | null;
  };
}

const gradeConfig: Record<string, { label: string; className: string }> = {
  USADO_A: {
    label: "Grade A",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  },
  USADO_B: {
    label: "Grade B",
    className: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  },
};

function maskSerial(serial: string) {
  if (serial.length <= 4) return serial;
  return `${serial.slice(0, 3)}****${serial.slice(-3)}`;
}

export function UsedItemCard({ item }: UsedItemCardProps) {
  const grade = gradeConfig[item.condition];
  const imageUrl = item.product?.main_image_url;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={`/item/${item.serial_number}`}
        className={cn(
          "group block overflow-hidden rounded-xl border border-white/5",
          "bg-card/50 backdrop-blur-sm transition-all",
          "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={item.product?.title ?? "Article"}
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
          {grade && (
            <Badge
              variant="outline"
              className={cn("absolute top-2.5 left-2.5 text-[10px]", grade.className)}
            >
              {grade.label}
            </Badge>
          )}
        </div>

        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight">
            {item.product?.title ?? "Article"}
          </h3>
          {item.serial_number && (
            <p className="mt-1 font-mono text-[10px] text-muted-foreground">
              {maskSerial(item.serial_number)}
            </p>
          )}
          <p className="mt-1.5 text-base font-bold text-primary">
            {formatMAD(item.price)}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

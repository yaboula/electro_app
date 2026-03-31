"use client";

import Image from "next/image";
import { useState } from "react";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  mainImage: string | null;
  title: string;
  extraImages?: string[];
}

export function ProductGallery({
  mainImage,
  title,
  extraImages = [],
}: ProductGalleryProps) {
  const allImages = [mainImage, ...extraImages].filter(Boolean) as string[];
  const [selected, setSelected] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-card/50 border border-white/5">
        <Package className="h-16 w-16 text-muted-foreground/20" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="group relative aspect-square overflow-hidden rounded-2xl bg-card/50 border border-white/5">
        <Image
          src={allImages[selected]}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                selected === i
                  ? "border-primary"
                  : "border-white/5 opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img}
                alt={`${title} ${i + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { formatMAD } from "@/lib/utils";

interface StickyCTAProps {
  itemId: string;
  price: number;
  label?: string;
}

export function StickyCTA({
  itemId,
  price,
  label = "Commander via WhatsApp",
}: StickyCTAProps) {
  return (
    <>
      {/* Desktop CTA */}
      <div className="hidden md:block">
        <Button
          size="lg"
          className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
          render={<Link href={`/checkout?item=${itemId}`} />}
        >
          <MessageCircle className="h-4 w-4" />
          {label} — {formatMAD(price)}
        </Button>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-white/10 bg-background/80 backdrop-blur-xl p-3 md:hidden">
        <Button
          size="lg"
          className="w-full gap-2 bg-green-600 text-white hover:bg-green-700"
          render={<Link href={`/checkout?item=${itemId}`} />}
        >
          <MessageCircle className="h-4 w-4" />
          {label} — {formatMAD(price)}
        </Button>
      </div>
    </>
  );
}

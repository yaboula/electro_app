"use client";

import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-8 w-8 text-red-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Quelque chose a mal tourné</h1>
        <p className="mb-6 text-muted-foreground">
          Une erreur inattendue s&apos;est produite. Veuillez réessayer ou
          retourner à l&apos;accueil.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button render={<Link href="/" />}>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}

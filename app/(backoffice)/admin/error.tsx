"use client";

import { AlertTriangle, RotateCcw, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminError({
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
        <h1 className="mb-2 text-2xl font-bold">Erreur Admin</h1>
        <p className="mb-6 text-muted-foreground">
          Une erreur s&apos;est produite dans le panneau d&apos;administration.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button render={<Link href="/admin/dashboard" />}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

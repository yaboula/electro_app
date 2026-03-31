import { Gamepad2, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StorefrontNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/10">
          <Gamepad2 className="h-10 w-10 text-violet-400" />
        </div>
        <h1 className="mb-2 text-3xl font-bold">404</h1>
        <p className="mb-1 text-xl font-semibold">Page introuvable</p>
        <p className="mb-8 text-muted-foreground">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex justify-center gap-3">
          <Button render={<Link href="/" />}>
            <Home className="mr-2 h-4 w-4" />
            Accueil
          </Button>
          <Button variant="outline" render={<Link href="/search" />}>
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
}

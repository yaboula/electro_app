import { PackageX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
          <PackageX className="h-8 w-8 text-orange-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Produit introuvable</h1>
        <p className="mb-8 text-muted-foreground">
          Ce produit n&apos;existe pas ou n&apos;est plus disponible dans notre
          catalogue.
        </p>
        <Button render={<Link href="/p" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voir tous les produits
        </Button>
      </div>
    </div>
  );
}

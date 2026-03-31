import { PackageX, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ItemNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/10">
          <PackageX className="h-8 w-8 text-orange-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold">Article introuvable</h1>
        <p className="mb-8 text-muted-foreground">
          Cet article d&apos;occasion n&apos;existe pas ou a déjà été vendu.
        </p>
        <Button render={<Link href="/item" />}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voir les articles d&apos;occasion
        </Button>
      </div>
    </div>
  );
}

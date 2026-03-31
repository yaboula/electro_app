"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteProductAction } from "./actions";

export function DeleteProductButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <ConfirmDialog
      title="Supprimer le produit"
      description={`Êtes-vous sûr de vouloir supprimer "${title}" ? Cette action supprimera aussi tous les articles d'inventaire associés.`}
      trigger={
        <Button variant="ghost" size="icon-sm" className="text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Supprimer</span>
        </Button>
      }
      onConfirm={async () => {
        await deleteProductAction(id);
      }}
    />
  );
}

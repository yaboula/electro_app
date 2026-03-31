"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteInventoryAction } from "./actions";

export function DeleteInventoryButton({ id }: { id: string }) {
  return (
    <ConfirmDialog
      title="Supprimer l'article"
      description="Êtes-vous sûr de vouloir supprimer cet article d'inventaire ? Cette action est irréversible."
      trigger={
        <Button variant="ghost" size="icon-sm" className="text-destructive">
          <Trash2 className="h-3.5 w-3.5" />
          <span className="sr-only">Supprimer</span>
        </Button>
      }
      onConfirm={async () => {
        await deleteInventoryAction(id);
      }}
    />
  );
}

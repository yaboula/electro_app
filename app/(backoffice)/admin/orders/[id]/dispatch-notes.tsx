"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { updateDispatchNotesAction } from "../actions";

export function DispatchNotes({
  orderId,
  initialNotes,
}: {
  orderId: string;
  initialNotes: string;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    startTransition(async () => {
      await updateDispatchNotesAction(orderId, notes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <Card className="border-white/5 bg-card/50">
      <CardContent className="p-5 space-y-3">
        <h2 className="text-sm font-semibold">Notes de Dispatch</h2>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Numéro de tracking, transporteur, instructions..."
          rows={4}
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isPending}
          className="gap-1.5"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saved ? "Enregistré !" : "Enregistrer"}
        </Button>
      </CardContent>
    </Card>
  );
}

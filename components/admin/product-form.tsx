"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { slugify } from "@/lib/utils";
import { PLATFORMS, PRODUCT_TYPES } from "@/lib/validations";
import { Loader2 } from "lucide-react";
import type { Product } from "@/types";

interface ProductFormProps {
  product?: Product;
  action: (
    prev: { error: string } | null,
    formData: FormData
  ) => Promise<{ error: string } | null>;
}

const typeLabels: Record<string, string> = {
  console: "Console",
  game: "Jeu",
  accessory: "Accessoire",
};

export function ProductForm({ product, action }: ProductFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [imageUrl, setImageUrl] = useState<string | null>(
    product?.main_image_url ?? null
  );
  const [slugValue, setSlugValue] = useState(product?.slug ?? "");
  const titleRef = useRef<HTMLInputElement>(null);

  const handleTitleBlur = () => {
    if (!product && titleRef.current) {
      setSlugValue(slugify(titleRef.current.value));
    }
  };

  return (
    <Card className="border-white/5 bg-card/50">
      <CardContent className="p-6">
        <form action={formAction} className="space-y-6">
          <input type="hidden" name="main_image_url" value={imageUrl ?? ""} />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                name="title"
                ref={titleRef}
                defaultValue={product?.title ?? ""}
                onBlur={handleTitleBlur}
                placeholder="PlayStation 5 Standard"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                name="slug"
                value={slugValue}
                onChange={(e) => setSlugValue(e.target.value)}
                placeholder="ps5-standard"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Plateforme</Label>
              <select
                id="platform"
                name="platform"
                defaultValue={product?.platform ?? ""}
                required
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                <option value="" disabled>
                  Choisir...
                </option>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                name="type"
                defaultValue={product?.type ?? "console"}
                required
                className="flex h-8 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
              >
                {PRODUCT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {typeLabels[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="base_description">Description</Label>
            <Textarea
              id="base_description"
              name="base_description"
              defaultValue={product?.base_description ?? ""}
              placeholder="Décrivez le produit..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Image principale</Label>
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
              path={product?.id ?? `temp-${Date.now()}`}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="is_published"
              name="is_published"
              defaultChecked={product?.is_published ?? false}
            />
            <Label htmlFor="is_published">Publié (visible sur la boutique)</Label>
          </div>

          {state?.error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {product ? "Enregistrer" : "Créer le produit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

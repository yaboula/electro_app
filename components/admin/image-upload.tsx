"use client";

import { useCallback, useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  path: string;
  className?: string;
}

const ACCEPTED = ".jpg,.jpeg,.png,.webp";
const MAX_SIZE = 5 * 1024 * 1024;

export function ImageUpload({
  value,
  onChange,
  bucket = "product-images",
  path,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setError(null);

      if (file.size > MAX_SIZE) {
        setError("Le fichier doit faire moins de 5 Mo");
        return;
      }

      setUploading(true);
      try {
        const supabase = createClient();
        const timestamp = Date.now();
        const ext = file.name.split(".").pop() ?? "webp";
        const filePath = `${path}/main_${timestamp}.${ext}`;

        if (value) {
          const oldPath = extractStoragePath(value, bucket);
          if (oldPath) {
            await supabase.storage.from(bucket).remove([oldPath]);
          }
        }

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, { upsert: false });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);

        onChange(publicUrl);
      } catch (err) {
        setError("Erreur lors du téléchargement");
        console.error(err);
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, bucket, path]
  );

  const handleRemove = useCallback(async () => {
    if (!value) return;
    const supabase = createClient();
    const oldPath = extractStoragePath(value, bucket);
    if (oldPath) {
      await supabase.storage.from(bucket).remove([oldPath]);
    }
    onChange(null);
  }, [value, onChange, bucket]);

  return (
    <div className={cn("space-y-2", className)}>
      {value ? (
        <div className="relative inline-block">
          <Image
            src={value}
            alt="Aperçu"
            width={200}
            height={200}
            className="rounded-lg border border-white/10 object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-white text-xs"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <label
          className={cn(
            "flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/10 transition-colors hover:border-primary/30 hover:bg-primary/5",
            uploading && "pointer-events-none opacity-50"
          )}
        >
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <ImagePlus className="h-6 w-6 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {uploading ? "Téléchargement..." : "Cliquez pour ajouter une image"}
          </span>
          <input
            type="file"
            accept={ACCEPTED}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function extractStoragePath(
  publicUrl: string,
  bucket: string
): string | null {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

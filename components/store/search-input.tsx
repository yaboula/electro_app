"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const currentQuery = searchParams.get("q") ?? "";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleChange = useCallback(
    (value: string) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        if (value.trim()) {
          router.push(`/search?q=${encodeURIComponent(value.trim())}`, {
            scroll: false,
          });
        } else {
          router.push("/search", { scroll: false });
        }
      }, 300);
    },
    [router]
  );

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
    router.push("/search", { scroll: false });
  };

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        defaultValue={currentQuery}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Rechercher un produit, une console..."
        className={cn(
          "h-12 w-full rounded-xl border border-white/10 bg-card/50 pl-12 pr-10 text-base outline-none",
          "placeholder:text-muted-foreground/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
          "backdrop-blur-sm transition-all"
        )}
      />
      {currentQuery && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

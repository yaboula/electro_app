"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  "Tous",
  "PS5",
  "PS4",
  "Xbox Series",
  "Xbox One",
  "Nintendo Switch",
  "PC",
  "Accessoire",
];

const SORT_OPTIONS = [
  { value: "", label: "Plus récent" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

export function PlatformFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPlatform = searchParams.get("platform") ?? "";
  const currentSort = searchParams.get("sort") ?? "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {PLATFORMS.map((p) => {
          const value = p === "Tous" ? "" : p;
          const isActive = currentPlatform === value;
          return (
            <button
              key={p}
              onClick={() => updateParams("platform", value)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-white/5"
              )}
            >
              {p}
            </button>
          );
        })}
      </div>

      <select
        value={currentSort}
        onChange={(e) => updateParams("sort", e.target.value)}
        className="h-8 shrink-0 rounded-lg border border-white/10 bg-card/50 px-3 text-xs outline-none focus:border-ring"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

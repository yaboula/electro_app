"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const GRADES = [
  { value: "", label: "Tous" },
  { value: "A", label: "Grade A" },
  { value: "B", label: "Grade B" },
];

const PLATFORMS = [
  "Tous",
  "PS5",
  "PS4",
  "Xbox Series",
  "Xbox One",
  "Nintendo Switch",
  "PC",
];

export function GradeFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentGrade = searchParams.get("grade") ?? "";
  const currentPlatform = searchParams.get("platform") ?? "";

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
      <div className="flex gap-1.5">
        {GRADES.map((g) => {
          const isActive = currentGrade === g.value;
          return (
            <button
              key={g.value}
              onClick={() => updateParams("grade", g.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-white/5"
              )}
            >
              {g.label}
            </button>
          );
        })}
      </div>

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
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const platformColors: Record<string, string> = {
  PS5: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PS4: "bg-blue-600/10 text-blue-300 border-blue-600/20",
  "Xbox Series": "bg-green-500/10 text-green-400 border-green-500/20",
  "Xbox One": "bg-green-600/10 text-green-300 border-green-600/20",
  "Nintendo Switch": "bg-red-500/10 text-red-400 border-red-500/20",
  PC: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Accessoire: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

const conditionColors: Record<string, { label: string; className: string }> = {
  NUEVO: {
    label: "Neuf",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  USADO_A: {
    label: "Occasion A",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  USADO_B: {
    label: "Occasion B",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
};

export function PlatformBadge({ platform }: { platform: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-xs", platformColors[platform] ?? "bg-muted text-muted-foreground")}
    >
      {platform}
    </Badge>
  );
}

export function ConditionBadge({ condition }: { condition: string }) {
  const config = conditionColors[condition];
  if (!config) return null;
  return (
    <Badge variant="outline" className={cn("text-xs", config.className)}>
      {config.label}
    </Badge>
  );
}

export function PublishBadge({ isPublished }: { isPublished: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        isPublished
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-muted text-muted-foreground border-muted"
      )}
    >
      {isPublished ? "Publié" : "Brouillon"}
    </Badge>
  );
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs",
        isActive
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-red-500/10 text-red-400 border-red-500/20"
      )}
    >
      {isActive ? "Actif" : "Inactif"}
    </Badge>
  );
}

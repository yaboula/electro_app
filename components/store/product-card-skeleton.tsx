import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-white/5 bg-card/50">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <CardContent className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
      </CardContent>
    </Card>
  );
}

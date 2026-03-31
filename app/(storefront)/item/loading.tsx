import { ProductCardSkeleton } from "@/components/store/product-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsedItemsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="mb-2 h-8 w-52" />
      <Skeleton className="mb-6 h-4 w-72" />

      <div className="mb-8 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

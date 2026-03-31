import { getPublishedProducts } from "@/lib/queries";
import { HomeContent } from "@/components/store/home-content";

export default async function HomePage() {
  const products = await getPublishedProducts();
  const featured = products.slice(0, 8);

  return <HomeContent products={featured} />;
}

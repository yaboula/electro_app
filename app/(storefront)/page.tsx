import { HeroSection } from "@/components/store/hero-section";
import { CategoryGrid } from "@/components/store/category-grid";
import { FeaturedSection } from "@/components/store/featured-section";
import { TrustBanner } from "@/components/store/trust-banner";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <CategoryGrid />
      <FeaturedSection />
      <TrustBanner />
    </div>
  );
}

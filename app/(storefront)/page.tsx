import { HeroSection }    from "@/components/store/hero-section";
import { FlashSale }       from "@/components/store/flash-sale";
import { CategoryGrid }    from "@/components/store/category-grid";
import { FeaturedSection } from "@/components/store/featured-section";
import { BrandsBanner }    from "@/components/store/brands-banner";
import { UsedSection }     from "@/components/store/used-section";
import { TrustBanner }     from "@/components/store/trust-banner";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <HeroSection />
      <FlashSale />
      <CategoryGrid />
      <FeaturedSection />
      <BrandsBanner />
      <UsedSection />
      <TrustBanner />
    </div>
  );
}

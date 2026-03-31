import { Header } from "@/components/store/header";
import { BottomNav } from "@/components/store/bottom-nav";
import { SiteFooter } from "@/components/store/site-footer";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <BottomNav />
      <div className="h-20 md:hidden" />
    </div>
  );
}

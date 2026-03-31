import { Header } from "@/components/store/header";
import { BottomNav } from "@/components/store/bottom-nav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      {/* offset for fixed header: 68px mobile, 74px desktop */}
      <main className="flex-1 pt-[68px] md:pt-[74px]">{children}</main>
      <BottomNav />
      {/* Spacer for mobile bottom nav */}
      <div className="h-20 md:hidden" />
    </div>
  );
}

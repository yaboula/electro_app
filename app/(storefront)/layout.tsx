import { Header, MobileHeader } from "@/components/store/header";
import { BottomNav } from "@/components/store/bottom-nav";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <MobileHeader />
      <main className="flex-1">{children}</main>
      <BottomNav />
      {/* Spacer to prevent content from hiding behind bottom nav on mobile */}
      <div className="h-16 md:hidden" />
    </div>
  );
}

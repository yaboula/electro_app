"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Warehouse,
  ClipboardList,
  LogOut,
  Gamepad2,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/(backoffice)/admin/actions";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/inventory", label: "Inventaire", icon: Warehouse },
  { href: "/admin/orders", label: "Commandes", icon: ClipboardList },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="p-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Gamepad2 className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">ELECTRO</span>
            <span className="text-muted-foreground">.ma</span>
          </span>
        </Link>
      </div>

      <Separator className="bg-white/5" />

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-white/5" />

      <div className="p-3">
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  return (
    <aside
      className={cn(
        "hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0",
        "border-r border-white/5",
        "bg-card/30 backdrop-blur-xl"
      )}
    >
      <SidebarContent />
    </aside>
  );
}

export function AdminMobileNav() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 items-center gap-3 px-4 md:hidden",
        "border-b border-white/5",
        "bg-background/60 backdrop-blur-xl"
      )}
    >
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="text-muted-foreground" />
          }
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-60 p-0 bg-card/95 backdrop-blur-xl border-white/5"
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation admin</SheetTitle>
          </SheetHeader>
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <Link href="/admin/dashboard" className="flex items-center gap-2">
        <Gamepad2 className="h-5 w-5 text-primary" />
        <span className="text-sm font-bold">
          <span className="text-primary">ELECTRO</span>
          <span className="text-muted-foreground">.ma</span>
        </span>
      </Link>
    </header>
  );
}

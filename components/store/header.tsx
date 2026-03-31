"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Search, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/p", label: "Produits" },
  { href: "/item", label: "Occasions" },
];

export function Header() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 hidden md:block",
        "border-b border-white/10",
        "bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <Gamepad2 className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-primary">ELECTRO</span>
            <span className="text-muted-foreground">.ma</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative px-4 py-2 text-sm font-medium text-muted-foreground",
                "transition-colors hover:text-foreground",
                "after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2",
                "after:h-0.5 after:w-0 after:bg-primary after:transition-all",
                "hover:after:w-2/3"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            render={<Link href="/search" />}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Rechercher</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              0
            </span>
            <span className="sr-only">Panier</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

export function MobileHeader() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 md:hidden",
        "border-b border-white/10",
        "bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40"
      )}
    >
      <div className="flex h-14 items-center justify-between px-4">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="text-muted-foreground" />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-background/95 backdrop-blur-xl border-white/10">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 text-left">
                <Gamepad2 className="h-6 w-6 text-primary" />
                <span>
                  <span className="text-primary">ELECTRO</span>
                  <span className="text-muted-foreground">.ma</span>
                </span>
              </SheetTitle>
            </SheetHeader>
            <nav className="mt-8 flex flex-col gap-1">
              {navLinks.map((link) => (
                <SheetClose
                  key={link.href}
                  render={
                    <Link
                      href={link.href}
                      className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    />
                  }
                >
                  {link.label}
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">ELECTRO</span>
            <span className="text-muted-foreground">.ma</span>
          </span>
        </Link>

        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            0
          </span>
          <span className="sr-only">Panier</span>
        </Button>
      </div>
    </motion.header>
  );
}

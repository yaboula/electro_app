"use client";

// HeroUI components work without a root provider.
// RouterProvider is only needed for Next.js Link integration in HeroUI's
// internal navigation (e.g. Breadcrumbs). We wrap it here for future use.
import { RouterProvider } from "@heroui/react";
import { useRouter } from "next/navigation";

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <RouterProvider navigate={router.push}>
      {children}
    </RouterProvider>
  );
}

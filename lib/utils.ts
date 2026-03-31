import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMAD(amount: number): string {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Normalize a Moroccan phone number to the canonical format +212XXXXXXXXX.
 * Mirrors the PostgreSQL function `normalize_moroccan_phone` for consistency.
 */
export function normalizePhone(raw: string): string {
  let cleaned = raw.replace(/[\s\-.\(\)]/g, "");
  if (cleaned.startsWith("00212")) {
    cleaned = "+212" + cleaned.slice(5);
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "+212" + cleaned.slice(1);
  } else if (!cleaned.startsWith("+212")) {
    cleaned = "+212" + cleaned;
  }
  return cleaned;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "à l'instant";
  if (diffMin < 60) return `il y a ${diffMin}min`;
  if (diffH < 24) return `il y a ${diffH}h`;
  if (diffD < 7) return `il y a ${diffD}j`;
  return new Intl.DateTimeFormat("fr-MA", { dateStyle: "medium" }).format(past);
}

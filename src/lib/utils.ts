import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPkr(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function normalizePkPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (/^03\d{9}$/.test(digits)) return digits;
  if (/^923\d{9}$/.test(digits)) return `0${digits.slice(2)}`;
  return null;
}

export function waLink(phoneE164Digits: string, text: string): string {
  const n = phoneE164Digits.replace(/\D/g, "");
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

/** Public storefront origin for WhatsApp / SEO links (no trailing slash). */
export function siteOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "");
  }
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return "https://woodcraft-phi.vercel.app";
}

export function productUrl(slug: string): string {
  return `${siteOrigin()}/product/${slug}`;
}

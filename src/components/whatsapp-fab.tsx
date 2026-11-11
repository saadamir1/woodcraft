"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";

export function WhatsAppFab({
  whatsappNumber,
  productHint,
}: {
  whatsappNumber: string;
  productHint?: string;
}) {
  const pathname = usePathname();
  const cartOpen = useCart((s) => s.open);
  // Mobile bottom nav already has WhatsApp — keep FAB desktop-only
  if (pathname.startsWith("/admin") || cartOpen) return null;

  const text = productHint
    ? `Hi WoodCraft — I'm interested in ${productHint}`
    : "Hi WoodCraft — I have a question about your wooden products.";

  return (
    <a
      href={waLink(whatsappNumber, text)}
      target="_blank"
      rel="noreferrer"
      className="hidden md:flex fixed z-30 bottom-6 right-6 size-14 rounded-full bg-[#25D366] text-white shadow-lg items-center justify-center hover:scale-105 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}

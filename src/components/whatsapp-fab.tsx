"use client";

import { MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";
import { waLink } from "@/lib/utils";

export function WhatsAppFab({
  whatsappNumber,
  productHint,
}: {
  whatsappNumber: string;
  productHint?: string;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const text = productHint
    ? `Hi WoodCraft — I'm interested in ${productHint}`
    : "Hi WoodCraft — I have a question about your wooden products.";

  return (
    <a
      href={waLink(whatsappNumber, text)}
      target="_blank"
      rel="noreferrer"
      className="fixed z-30 bottom-20 right-4 md:bottom-6 md:right-6 size-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="size-7" />
    </a>
  );
}

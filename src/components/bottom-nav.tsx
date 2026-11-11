"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { cn, waLink } from "@/lib/utils";

export function BottomNav({ whatsappNumber }: { whatsappNumber: string }) {
  const pathname = usePathname();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const setOpen = useCart((s) => s.setOpen);

  if (pathname.startsWith("/admin") || pathname.startsWith("/checkout")) {
    return null;
  }

  const item = (active: boolean) =>
    cn(
      "flex flex-col items-center gap-0.5 text-[11px] font-semibold",
      active ? "text-walnut" : "text-muted",
    );

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-[color-mix(in_srgb,var(--card)_94%,transparent)] backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-4 h-16">
        <Link href="/" className={cn(item(pathname === "/"), "justify-center")}>
          <Home className="size-5" />
          Home
        </Link>
        <Link
          href="/shop"
          className={cn(item(pathname.startsWith("/shop")), "justify-center")}
        >
          <Store className="size-5" />
          Shop
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(item(false), "justify-center relative")}
        >
          <ShoppingBag className="size-5" />
          Cart
          {count > 0 ? (
            <span className="absolute top-1 right-[28%] size-4 rounded-full bg-amber text-white text-[10px] flex items-center justify-center">
              {count}
            </span>
          ) : null}
        </button>
        <a
          href={waLink(whatsappNumber, "Hi WoodCraft — I have a question.")}
          target="_blank"
          rel="noreferrer"
          className={cn(item(false), "justify-center")}
        >
          <MessageCircle className="size-5" />
          WhatsApp
        </a>
      </div>
    </nav>
  );
}

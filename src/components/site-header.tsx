"use client";

import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { motion, AnimatePresence } from "motion/react";

export function SiteHeader({
  brandName,
  announcement,
}: {
  brandName: string;
  announcement?: string;
}) {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const setOpen = useCart((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[color-mix(in_srgb,var(--cream)_88%,transparent)] border-b border-border">
      {announcement ? (
        <div className="bg-walnut text-cream text-center text-xs sm:text-sm py-2 px-3">
          {announcement}
        </div>
      ) : null}
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="font-display text-xl text-walnut tracking-tight">
          {brandName}
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm font-medium text-walnut-soft">
          <Link href="/shop" className="hover:text-sage-deep">
            Shop
          </Link>
          <Link href="/about" className="hover:text-sage-deep">
            Our story
          </Link>
          <Link href="/track" className="hover:text-sage-deep">
            Track
          </Link>
          <Link href="/contact" className="hover:text-sage-deep">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/shop"
            className="p-2 rounded-full hover:bg-cream-2"
            aria-label="Search shop"
          >
            <Search className="size-5 text-walnut" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="relative p-2 rounded-full hover:bg-cream-2"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-5 text-walnut" />
            <AnimatePresence>
              {count > 0 ? (
                <motion.span
                  key={count}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 rounded-full bg-amber text-white text-[11px] font-bold flex items-center justify-center"
                >
                  {count}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}

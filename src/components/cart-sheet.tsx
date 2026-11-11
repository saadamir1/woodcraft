"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPkr, waLink } from "@/lib/utils";

export function CartSheet({ whatsappNumber }: { whatsappNumber: string }) {
  const { items, open, setOpen, setQty, remove, subtotal } = useCart();
  const total = subtotal();
  const waText =
    items.length === 0
      ? "Hi WoodCraft — I'd like to order."
      : `Hi WoodCraft — I'd like to order:\n${items
          .map((i) => `• ${i.name} × ${i.qty}`)
          .join("\n")}\nSubtotal: ${formatPkr(total)}`;

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            className="fixed inset-0 z-50 bg-black/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal
            aria-label="Cart"
            className="fixed z-50 inset-x-0 bottom-0 md:inset-y-0 md:right-0 md:left-auto md:w-[420px] bg-card rounded-t-3xl md:rounded-none border border-border shadow-2xl flex flex-col max-h-[88vh] md:max-h-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <h2 className="font-display text-xl text-walnut">Your cart</h2>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-cream-2"
                onClick={() => setOpen(false)}
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 ? (
                <p className="text-muted text-sm py-10 text-center">
                  Cart is empty. Browse the shop to add wood pieces.
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative size-18 w-[72px] h-[72px] rounded-xl overflow-hidden bg-cream-2 shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="72px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-sm text-muted">{formatPkr(item.pricePkr)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          className="size-8 rounded-full border border-border flex items-center justify-center"
                          onClick={() => setQty(item.productId, item.qty - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">
                          {item.qty}
                        </span>
                        <button
                          type="button"
                          className="size-8 rounded-full border border-border flex items-center justify-center"
                          onClick={() => setQty(item.productId, item.qty + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          className="ml-auto text-xs text-danger"
                          onClick={() => remove(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-border p-4 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatPkr(total)}</span>
              </div>
              <Link
                href="/checkout"
                className="btn btn-primary w-full"
                onClick={() => setOpen(false)}
                aria-disabled={items.length === 0}
                style={{
                  pointerEvents: items.length === 0 ? "none" : undefined,
                  opacity: items.length === 0 ? 0.5 : 1,
                }}
              >
                Checkout
              </Link>
              <a
                href={waLink(whatsappNumber, waText)}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sage w-full"
              >
                Order on WhatsApp
              </a>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

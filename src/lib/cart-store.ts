"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  pricePkr: number;
  imageUrl: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setOpen: (open) => set({ open }),
      add: (item, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.productId === item.productId);
        if (i >= 0) items[i] = { ...items[i], qty: items[i].qty + qty };
        else items.push({ ...item, qty });
        set({ items, open: true });
      },
      remove: (productId) =>
        set({ items: get().items.filter((x) => x.productId !== productId) }),
      setQty: (productId, qty) => {
        if (qty <= 0) {
          get().remove(productId);
          return;
        }
        set({
          items: get().items.map((x) =>
            x.productId === productId ? { ...x, qty } : x,
          ),
        });
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.qty, 0),
      subtotal: () => get().items.reduce((n, i) => n + i.pricePkr * i.qty, 0),
    }),
    {
      name: "woodcraft-cart",
      partialize: (s) => ({ items: s.items, open: s.open }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

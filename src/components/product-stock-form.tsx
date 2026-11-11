"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductStockForm({
  productId,
  stock,
  pricePkr,
}: {
  productId: string;
  stock: number;
  pricePkr: number;
}) {
  const router = useRouter();
  const [s, setS] = useState(stock);
  const [price, setPrice] = useState(pricePkr);

  async function save() {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId, stock: s, pricePkr: price }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2 items-center">
      <input
        type="number"
        className="input w-20 min-h-10 py-1"
        value={s}
        onChange={(e) => setS(Number(e.target.value))}
        aria-label="Stock"
      />
      <input
        type="number"
        className="input w-24 min-h-10 py-1"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        aria-label="Price"
      />
      <button type="button" className="btn btn-secondary text-sm" onClick={save}>
        Save
      </button>
    </div>
  );
}

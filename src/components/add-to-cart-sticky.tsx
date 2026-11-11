"use client";

import { useEffect, useState } from "react";
import { formatPkr, waLink } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";
import { trackPixel } from "@/components/meta-pixel";

export function AddToCartSticky({
  product,
  whatsappNumber,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    pricePkr: number;
    imageUrl: string;
    stock: number;
  };
  whatsappNumber: string;
}) {
  const add = useCart((s) => s.add);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById("primary-atc");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setShow(!e.isIntersecting),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function onAdd() {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      pricePkr: product.pricePkr,
      imageUrl: product.imageUrl,
    });
    trackPixel("AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      value: product.pricePkr,
      currency: "PKR",
    });
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "AddToCart",
        productId: product.id,
        path: `/product/${product.slug}`,
      }),
    }).catch(() => {});
  }

  return (
    <>
      <div id="primary-atc" className="flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          className="btn btn-primary flex-1"
          disabled={product.stock <= 0}
          onClick={onAdd}
        >
          {product.stock <= 0 ? "Sold out" : "Add to cart"}
        </button>
        <a
          href={waLink(
            whatsappNumber,
            `Hi WoodCraft — I'd like to order: ${product.name} (${formatPkr(product.pricePkr)}) https://woodcraft.pk/product/${product.slug}`,
          )}
          target="_blank"
          rel="noreferrer"
          className="btn btn-sage flex-1"
        >
          Order on WhatsApp
        </a>
      </div>
      {show ? (
        <div className="fixed inset-x-0 bottom-16 md:bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-6xl flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">{product.name}</p>
              <p className="text-xs text-muted">{formatPkr(product.pricePkr)}</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={product.stock <= 0}
              onClick={onAdd}
            >
              Add
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

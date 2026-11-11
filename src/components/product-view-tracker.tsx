"use client";

import { useEffect } from "react";
import { trackPixel } from "@/components/meta-pixel";

export function ProductViewTracker({
  productId,
  name,
  pricePkr,
  slug,
}: {
  productId: string;
  name: string;
  pricePkr: number;
  slug: string;
}) {
  useEffect(() => {
    trackPixel("ViewContent", {
      content_ids: [productId],
      content_name: name,
      value: pricePkr,
      currency: "PKR",
    });
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "ViewContent",
        productId,
        path: `/product/${slug}`,
      }),
    }).catch(() => {});
  }, [productId, name, pricePkr, slug]);
  return null;
}

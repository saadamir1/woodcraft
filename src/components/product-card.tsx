"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { formatPkr } from "@/lib/utils";
import { useCart } from "@/lib/cart-store";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    pricePkr: number;
    compareAt?: number | null;
    imageUrl: string;
    stock: number;
    lowStockAt: number;
  };
  index?: number;
};

export function ProductCard({ product, index = 0 }: Props) {
  const add = useCart((s) => s.add);
  const low = product.stock > 0 && product.stock <= product.lowStockAt;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
      className="card overflow-hidden group"
    >
      <Link href={`/product/${product.slug}`} className="block relative aspect-[4/5] bg-cream-2">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width:768px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {low ? (
          <span className="badge absolute top-3 left-3 bg-amber text-white">
            Low stock
          </span>
        ) : null}
      </Link>
      <div className="p-3 sm:p-4 space-y-2">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-medium text-walnut leading-snug line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-semibold text-ink">{formatPkr(product.pricePkr)}</span>
            {product.compareAt ? (
              <span className="text-sm text-muted line-through">
                {formatPkr(product.compareAt)}
              </span>
            ) : null}
          </div>
        </Link>
        <button
          type="button"
          className="btn btn-primary w-full text-sm"
          disabled={product.stock <= 0}
          onClick={() =>
            add({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              pricePkr: product.pricePkr,
              imageUrl: product.imageUrl,
            })
          }
        >
          {product.stock <= 0 ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </motion.article>
  );
}

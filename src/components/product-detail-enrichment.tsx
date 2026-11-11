"use client";

import Link from "next/link";
import {
  Truck,
  HandCoins,
  Droplets,
  Ruler,
  BadgePercent,
  Clock3,
} from "lucide-react";
import { Reveal } from "@/components/reveal";
import { formatPkr } from "@/lib/utils";

export function ProductBreadcrumb({
  categorySlug,
  categoryName,
  name,
}: {
  categorySlug: string;
  categoryName: string;
  name: string;
}) {
  return (
    <nav className="text-xs text-muted mb-4 flex flex-wrap gap-1.5 items-center">
      <Link href="/" className="hover:text-walnut">
        Home
      </Link>
      <span>/</span>
      <Link href="/shop" className="hover:text-walnut">
        Shop
      </Link>
      <span>/</span>
      <Link href={`/shop?category=${categorySlug}`} className="hover:text-walnut">
        {categoryName}
      </Link>
      <span>/</span>
      <span className="text-walnut font-medium line-clamp-1">{name}</span>
    </nav>
  );
}

export function ProductSaleBadge({
  pricePkr,
  compareAt,
}: {
  pricePkr: number;
  compareAt?: number | null;
}) {
  if (!compareAt || compareAt <= pricePkr) return null;
  const pct = Math.round(((compareAt - pricePkr) / compareAt) * 100);
  return (
    <span className="badge bg-amber text-white gap-1">
      <BadgePercent className="size-3.5" />
      Save {pct}%
    </span>
  );
}

export function ProductPromiseStrip({
  freeDeliveryThresholdPkr,
}: {
  freeDeliveryThresholdPkr: number;
}) {
  const items = [
    {
      icon: Truck,
      title: "2–5 day cities",
      body: "Courier ETA for Lahore, Karachi, Islamabad & peers",
    },
    {
      icon: HandCoins,
      title: "COD ready",
      body: "Or JazzCash / Easypaisa with TID at checkout",
    },
    {
      icon: Clock3,
      title: "WhatsApp confirm",
      body: "We message before packing — change address easily",
    },
    {
      icon: Droplets,
      title: "Care included",
      body: "Oil & dry tips so the wood ages kindly",
    },
  ];
  return (
    <Reveal className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {items.map((it) => (
        <div key={it.title} className="card p-4 flex gap-3">
          <it.icon className="size-5 text-sage-deep shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-walnut">{it.title}</p>
            <p className="text-xs text-muted mt-1 leading-relaxed">{it.body}</p>
          </div>
        </div>
      ))}
      <p className="sm:col-span-2 lg:col-span-4 text-xs text-muted px-1">
        Free delivery when your cart reaches {formatPkr(freeDeliveryThresholdPkr)}.
      </p>
    </Reveal>
  );
}

export function ProductLongCopy({
  name,
  material,
  size,
  care,
  description,
}: {
  name: string;
  material?: string | null;
  size?: string | null;
  care?: string | null;
  description: string;
}) {
  return (
    <section className="mt-12 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
      <Reveal>
        <h2 className="font-display text-3xl text-walnut">About this piece</h2>
        <p className="mt-3 text-muted leading-relaxed">{description}</p>
        <p className="mt-4 text-muted leading-relaxed">
          {name} is finished for daily Pakistani kitchens and playrooms — wipe spills
          promptly, avoid dishwashers, and keep it away from standing water. Small marks
          are part of honest wood; they soften into character with use.
        </p>
        <div className="mt-6 space-y-3">
          <details className="card px-4 py-3" open>
            <summary className="font-semibold text-walnut cursor-pointer">
              Delivery & payment
            </summary>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Major cities typically 2–5 days after WhatsApp confirmation. Choose COD or
              send JazzCash / Easypaisa and share your TID. We pack with edge protection
              for boards and bowls.
            </p>
          </details>
          <details className="card px-4 py-3">
            <summary className="font-semibold text-walnut cursor-pointer">
              Returns
            </summary>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Damaged or wrong item? WhatsApp photos within 48 hours — we sort a replace or
              refund path quickly. See our returns policy for full terms.
            </p>
          </details>
          <details className="card px-4 py-3">
            <summary className="font-semibold text-walnut cursor-pointer">
              Gifting tip
            </summary>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Pair a board with a spice box or coaster set for a warm house gift. Add a
              note at checkout — we&apos;ll keep packaging presentable.
            </p>
          </details>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="card p-5 sm:p-6 space-y-4 h-fit sticky top-24">
          <h3 className="font-display text-2xl text-walnut flex items-center gap-2">
            <Ruler className="size-5 text-sage-deep" />
            Specs at a glance
          </h3>
          <dl className="space-y-3 text-sm">
            {material ? (
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted">Material</dt>
                <dd className="font-medium text-right">{material}</dd>
              </div>
            ) : null}
            {size ? (
              <div className="flex justify-between gap-4 border-b border-border pb-2">
                <dt className="text-muted">Size</dt>
                <dd className="font-medium text-right">{size}</dd>
              </div>
            ) : null}
            {care ? (
              <div>
                <dt className="text-muted">Care</dt>
                <dd className="font-medium mt-1 leading-relaxed">{care}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4 border-b border-border pb-2">
              <dt className="text-muted">Made for</dt>
              <dd className="font-medium text-right">Home use · Pakistan</dd>
            </div>
          </dl>
        </div>
      </Reveal>
    </section>
  );
}

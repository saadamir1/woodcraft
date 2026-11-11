"use client";

import { SafeImage } from "@/components/safe-image";
import { formatPkr } from "@/lib/utils";

export function HomeHeroMedia() {
  return (
    <div className="relative aspect-[4/5] sm:aspect-[5/4] rounded-[1.5rem] overflow-hidden border border-border shadow-[var(--shadow)]">
      <SafeImage
        src="/products/hero-home.jpg"
        alt="Warm wooden pieces for kitchen and home"
        fill
        priority
        className="object-cover"
        sizes="(max-width:1024px) 100vw, 50vw"
      />
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent text-white">
        <p className="font-display text-2xl">Kitchen · Kids · Gifting</p>
        <p className="text-sm opacity-90">From {formatPkr(750)}</p>
      </div>
    </div>
  );
}

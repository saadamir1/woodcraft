"use client";

import { SafeImage } from "@/components/safe-image";
import { TiltCard } from "@/components/tilt-card";

export function ProductHeroImage({
  src,
  alt,
  tilt,
}: {
  src: string;
  alt: string;
  tilt?: boolean;
}) {
  const frame = (
    <div className="relative aspect-square rounded-3xl overflow-hidden border border-border bg-cream-2">
      <SafeImage
        src={src}
        alt={alt}
        fill
        priority
        className="object-cover"
        sizes="(max-width:1024px) 100vw, 50vw"
      />
    </div>
  );
  return tilt ? <TiltCard>{frame}</TiltCard> : frame;
}

"use client";

import { SafeImage } from "@/components/safe-image";
import { TiltCard } from "@/components/tilt-card";

export function ProductHeroImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
  /** kept for callers; tilt is always on for desktop now */
  tilt?: boolean;
}) {
  return (
    <TiltCard maxTilt={7} autoSway={false} className="w-full">
      <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-border bg-cream-2 shadow-[var(--shadow)]">
        <SafeImage
          src={src}
          alt={alt}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width:768px) 100vw, 50vw"
        />
      </div>
    </TiltCard>
  );
}

"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatPkr } from "@/lib/utils";
import { TiltCard } from "@/components/tilt-card";

/** Soft floating 3D hero frame — transform-only, skips motion when reduced. */
export function HomeHero3D() {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      {!reduce ? (
        <>
          <motion.div
            aria-hidden
            className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-amber/25 via-transparent to-sage/20 blur-2xl"
            animate={{ opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute -right-4 top-8 size-24 rounded-full bg-sage/20 blur-xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      ) : null}

      <TiltCard maxTilt={7} className="relative z-[1]">
        <motion.div
          className="relative aspect-[4/5] sm:aspect-[5/4] rounded-[1.5rem] overflow-hidden border border-border shadow-[var(--shadow)] bg-cream-2"
          style={{ transformStyle: "preserve-3d" }}
          animate={reduce ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src="/products/hero-home.jpg"
            alt="Warm wooden pieces for kitchen and home"
            fill
            priority
            fetchPriority="high"
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
            style={{ transform: "translateZ(12px) scale(1.02)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white"
            style={{ transform: "translateZ(36px)" }}
          >
            <p className="font-display text-2xl">Kitchen · Kids · Gifting</p>
            <p className="text-sm opacity-90">From {formatPkr(750)}</p>
          </div>
        </motion.div>
      </TiltCard>
    </div>
  );
}

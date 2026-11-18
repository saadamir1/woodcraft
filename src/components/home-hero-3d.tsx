"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatPkr } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * Mobile-first hero — full scene in frame.
 * No auto sway / float (images stay still unless the user asks for motion).
 */
export function HomeHero3D() {
  const reduce = useReducedMotion();
  const [mobile, setMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="relative w-full">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-amber/30 via-transparent to-sage/25 blur-xl sm:blur-2xl opacity-60"
      />

      <div className="relative z-[1]">
        <motion.div
          className={
            mobile
              ? "relative w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow)] bg-cream-2 aspect-[3/2]"
              : "relative w-full overflow-hidden rounded-[1.5rem] border border-border shadow-[var(--shadow)] bg-cream-2 aspect-[5/4]"
          }
          initial={reduce ? false : { opacity: 0.92, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/products/hero-home.jpg"
            alt="Warm wooden pieces for kitchen and home"
            fill
            priority
            fetchPriority="high"
            sizes="(max-width:768px) 100vw, 50vw"
            style={
              mobile
                ? { objectFit: "contain", objectPosition: "center center" }
                : { objectFit: "cover", objectPosition: "center 55%" }
            }
          />
          <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent text-white">
            <p className="font-display text-xl sm:text-2xl">Kitchen · Kids · Gifting</p>
            <p className="text-xs sm:text-sm opacity-90">From {formatPkr(750)}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

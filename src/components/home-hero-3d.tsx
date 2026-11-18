"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { formatPkr } from "@/lib/utils";
import { useEffect, useState } from "react";

/**
 * Mobile-first hero — full furniture in frame + auto 3D (no mouse needed).
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
      {!reduce ? (
        <motion.div
          aria-hidden
          className="absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-amber/35 via-transparent to-sage/30 blur-xl sm:blur-2xl"
          animate={{ opacity: [0.35, 0.75, 0.35], scale: [0.98, 1.03, 0.98] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}

      <div className="relative z-[1] [perspective:1100px]">
        <motion.div
          className={
            mobile
              ? "relative w-full overflow-hidden rounded-2xl border border-border shadow-[var(--shadow)] bg-cream-2 aspect-[3/2]"
              : "relative w-full overflow-hidden rounded-[1.5rem] border border-border shadow-[var(--shadow)] bg-cream-2 aspect-[5/4]"
          }
          style={{ transformStyle: "preserve-3d", willChange: reduce ? undefined : "transform" }}
          initial={reduce ? false : { opacity: 0.9, scale: 0.97 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : {
                  opacity: 1,
                  scale: 1,
                  y: [0, -10, 0],
                  rotateY: [-5, 5, -5],
                  rotateX: [2.5, -2, 2.5],
                }
          }
          transition={{
            opacity: { duration: 0.45 },
            scale: { duration: 0.45 },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotateY: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
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

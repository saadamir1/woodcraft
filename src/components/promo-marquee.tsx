"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const DEFAULTS = [
  "Free delivery over Rs 7,000 · COD nationwide",
  "JazzCash & Easypaisa accepted · same-day confirm on WhatsApp",
  "Seasonal gift sets · kitchen + toys in warm wood",
  "Hand-finished pieces · oil care tips with every order",
];

export function PromoMarquee({
  messages,
  className = "",
}: {
  messages?: string[];
  className?: string;
}) {
  const items = (messages?.filter(Boolean).length ? messages : DEFAULTS) as string[];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 4200);
    return () => clearInterval(t);
  }, [items.length]);

  return (
    <div
      className={`bg-walnut text-cream overflow-hidden ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="relative h-9 sm:h-10 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={items[i]}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-center text-xs sm:text-sm font-medium tracking-wide"
          >
            {items[i]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="promo-marquee-track hidden" aria-hidden>
        {[...items, ...items].map((m, idx) => (
          <span key={`${m}-${idx}`} className="mx-8 whitespace-nowrap text-xs">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

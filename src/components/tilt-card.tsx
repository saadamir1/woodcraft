"use client";

import { motion, useMotionTemplate, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Depth only when the user moves a real mouse.
 * No auto sway — product / hero photos stay still on phones.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  autoSway = false,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  /** Kept for callers; auto sway is off by default and ignored. */
  autoSway?: boolean;
}) {
  void autoSway;
  const ref = useRef<HTMLDivElement>(null);
  const [pointerSteer, setPointerSteer] = useState(false);
  const rx = useSpring(0, { stiffness: 160, damping: 22, mass: 0.4 });
  const ry = useSpring(0, { stiffness: 160, damping: 22, mass: 0.4 });
  const glareX = useSpring(50, { stiffness: 120, damping: 24 });
  const glareY = useSpring(50, { stiffness: 120, damping: 24 });
  const glareBg = useMotionTemplate`radial-gradient(380px circle at ${glareX}% ${glareY}%, rgba(255,248,239,0.22), transparent 55%)`;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPointerSteer(false);
      return;
    }
    setPointerSteer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  function onMove(e: React.MouseEvent) {
    if (!pointerSteer) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * maxTilt * 2);
    rx.set((0.5 - py) * maxTilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function onLeave() {
    if (!pointerSteer) return;
    rx.set(0);
    ry.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <div className={`[perspective:1000px] ${className}`}>
      <motion.div
        ref={ref}
        style={{
          rotateX: pointerSteer ? rx : 0,
          rotateY: pointerSteer ? ry : 0,
          transformStyle: "preserve-3d",
          willChange: pointerSteer ? "transform" : undefined,
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative"
      >
        {children}
        {glare && pointerSteer ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
            style={{ background: glareBg }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}

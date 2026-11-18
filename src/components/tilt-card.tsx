"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Smooth pointer-follow 3D tilt (GPU transforms only).
 * Off for touch / reduced-motion so it never feels laggy on phones.
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(0, { stiffness: 160, damping: 22, mass: 0.4 });
  const ry = useSpring(0, { stiffness: 160, damping: 22, mass: 0.4 });
  const glareX = useSpring(50, { stiffness: 120, damping: 24 });
  const glareY = useSpring(50, { stiffness: 120, damping: 24 });
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,248,239,0.28), transparent 55%)`;

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  function onMove(e: React.MouseEvent) {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    mx.set(px);
    my.set(py);
    ry.set((px - 0.5) * maxTilt * 2);
    rx.set((0.5 - py) * maxTilt * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <div className={`[perspective:1100px] ${className}`}>
      <motion.div
        ref={ref}
        style={{
          rotateX: enabled ? rx : 0,
          rotateY: enabled ? ry : 0,
          transformStyle: "preserve-3d",
          willChange: enabled ? "transform" : undefined,
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative"
      >
        {children}
        {glare && enabled ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
            style={{ background: glareBg, transform: "translateZ(28px)" }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}

"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Mobile-first depth:
 * - Always auto-sway on touch / when idle (phones see real 3D)
 * - Fine pointer can steer while hovering
 * - Reduced motion: still
 */
export function TiltCard({
  children,
  className = "",
  maxTilt = 8,
  glare = true,
  autoSway = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  autoSway?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [pointerSteer, setPointerSteer] = useState(false);
  const steering = useRef(false);
  const rx = useSpring(0, { stiffness: 140, damping: 22, mass: 0.45 });
  const ry = useSpring(0, { stiffness: 140, damping: 22, mass: 0.45 });
  const glareX = useSpring(50, { stiffness: 110, damping: 24 });
  const glareY = useSpring(50, { stiffness: 110, damping: 24 });
  const glareBg = useMotionTemplate`radial-gradient(380px circle at ${glareX}% ${glareY}%, rgba(255,248,239,0.22), transparent 55%)`;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    // Real desktop: hover + fine pointer. Chrome device mode often lies as fine —
    // so we still keep auto sway unless the user is actively steering.
    const canSteer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setPointerSteer(canSteer);
  }, []);

  useEffect(() => {
    if (!enabled || !autoSway) return;
    let frame = 0;
    let raf = 0;
    const tick = () => {
      if (!steering.current) {
        frame += 0.022;
        const ampY = Math.min(maxTilt, 6);
        const ampX = Math.min(maxTilt * 0.5, 3);
        ry.set(Math.sin(frame) * ampY);
        rx.set(Math.cos(frame * 0.85) * ampX);
        glareX.set(50 + Math.sin(frame) * 20);
        glareY.set(50 + Math.cos(frame * 0.9) * 14);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, autoSway, maxTilt, rx, ry, glareX, glareY]);

  function onMove(e: React.MouseEvent) {
    if (!enabled || !pointerSteer) return;
    steering.current = true;
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
    steering.current = false;
  }

  return (
    <div className={`[perspective:1000px] ${className}`}>
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
            style={{ background: glareBg }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}

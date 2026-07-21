"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const MAX_PULL = 8; // px — kept deliberately small, this is a hint, not a game

/**
 * Subtle magnetic-hover wrapper for the site's primary CTA only. Nudges the
 * button a few px toward the pointer inside its own bounds, spring-eased.
 * Disabled on touch devices (no hover) and under prefers-reduced-motion.
 */
export function MagneticCta({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    // One-off client-side feature detection (no external subscription needed).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!enabled || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * MAX_PULL);
    y.set((relY / (rect.height / 2)) * MAX_PULL);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={enabled && !prefersReducedMotion ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}

"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";

const THUMB_HEIGHT = 64; // px — the visible blue segment
const TRACK_MARGIN = 28; // px top/bottom inset from viewport edges
const LINE_WIDTH = 2; // px — the visible line itself, kept narrow
const HANDLE_WIDTH = 22; // px — invisible grab target, wider than the visible line
const HANDLE_PAD = 14; // px — invisible grab margin above/below the visible thumb
const HANDLE_HEIGHT = THUMB_HEIGHT + HANDLE_PAD * 2;
const IDLE_OPACITY = 0.32; // never fully disappears — stays visible as "there's a scrollbar here"
const ACTIVE_OPACITY = 0.9;
const IDLE_DIM_MS = 900;
const GLOW_FADE_MS = 500; // glow reads as "while scrolling", so it fades faster than brightness

const GLOW_ON = "0 0 6px 1px rgba(0,167,231,0.55)";
const GLOW_OFF = "0 0 0px 0px rgba(0,167,231,0)";

/**
 * Replaces the native scrollbar on desktop with a slim brand-blue line at
 * the right edge. It stays faintly visible at rest (so it still reads as
 * "there's a scrollbar here") and brightens on scroll/hover/drag. The glow
 * only appears while genuinely scrolling (wheel, keyboard, or dragging this
 * control itself) — not on idle hover.
 *
 * Position has two sources on purpose: normal wheel/keyboard scrolling is
 * spring-smoothed (nice easing, matches the rest of the site's motion), but
 * while *dragging this handle*, position is set directly from the pointer
 * every move — no spring lag — because a scrollbar thumb must track the
 * cursor 1:1 or dragging feels broken.
 *
 * Only a small invisible handle that travels with the thumb is interactive
 * (grab it and drag up/down); the rest of the track is purely visual and
 * lets clicks pass through to the page, so you can't jump-scroll by
 * clicking anywhere on the grey line — you have to grab the thumb itself
 * (with some forgiving margin around it).
 *
 * Desktop-only (pointer: fine) — touch devices keep their native
 * (already auto-hiding overlay) scrollbar via the `data-native-scrollbar`
 * attribute toggled on <html>, which globals.css uses to skip the hide rule.
 */
export function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const [enabled, setEnabled] = React.useState(false);
  const [trackHeight, setTrackHeight] = React.useState(0);
  const [active, setActive] = React.useState(false);
  const [scrolling, setScrolling] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const draggingRef = React.useRef(false);
  const dimTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const glowTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.4,
  });

  const travel = Math.max(trackHeight - THUMB_HEIGHT, 0);
  // Plain (non-spring) motion value for the handle's rendered position.
  // Kept in sync with the spring while scrolling normally; overwritten
  // directly (bypassing the spring) while dragging, for zero-latency tracking.
  const posY = useMotionValue(-HANDLE_PAD);

  React.useEffect(() => {
    draggingRef.current = dragging;
  }, [dragging]);

  React.useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    // One-off client-side feature detection (no external subscription needed).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(isFinePointer);
    document.documentElement.toggleAttribute("data-native-scrollbar", !isFinePointer);

    function updateHeight() {
      setTrackHeight(window.innerHeight - TRACK_MARGIN * 2);
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Keep the handle synced to real scroll position via the smoothed spring —
  // but only when the user isn't actively dragging it themselves.
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (draggingRef.current) return;
    posY.set(latest * travel - HANDLE_PAD);
  });

  // Covers the initial paint and viewport resizes, before any scroll change
  // has fired to drive the sync above.
  React.useEffect(() => {
    if (!dragging) posY.set(scrollYProgress.get() * travel - HANDLE_PAD);
  }, [travel, dragging, scrollYProgress, posY]);

  const scheduleDim = React.useCallback(() => {
    if (dimTimer.current) clearTimeout(dimTimer.current);
    dimTimer.current = setTimeout(() => setActive(false), IDLE_DIM_MS);
  }, []);

  const scheduleGlowOff = React.useCallback(() => {
    if (glowTimer.current) clearTimeout(glowTimer.current);
    glowTimer.current = setTimeout(() => setScrolling(false), GLOW_FADE_MS);
  }, []);

  // Brightness + glow are tied to the native scroll event (not the motion
  // value's "change" event) — scrollYProgress can emit sub-pixel jitter on
  // some viewports/zoom levels that never settles, which would keep this
  // stuck lit forever. Dragging this control calls scrollTo(), which itself
  // fires native scroll events, so the glow engages during drag too.
  React.useEffect(() => {
    function onScroll() {
      setScrolling(true);
      scheduleGlowOff();
      if (draggingRef.current) return; // dragging already keeps `active` on
      setActive(true);
      scheduleDim();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (dimTimer.current) clearTimeout(dimTimer.current);
      if (glowTimer.current) clearTimeout(glowTimer.current);
    };
  }, [scheduleDim, scheduleGlowOff]);

  function scrollToPointer(clientY: number) {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    // Instant, direct assignment — no spring involved — so the handle
    // tracks the cursor with zero added latency while dragging.
    posY.set(ratio * travel - HANDLE_PAD);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    // behavior: "instant" overrides the global `scroll-behavior: smooth` —
    // without it, every scrollTo during a drag kicks off its own smooth-scroll
    // animation, and rapid pointermove calls fight each other into a laggy blur.
    window.scrollTo({ top: ratio * maxScroll, behavior: "instant" });
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (dimTimer.current) clearTimeout(dimTimer.current);
    setDragging(true);
    setActive(true);
    scrollToPointer(e.clientY);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;
    scrollToPointer(e.clientY);
  }

  function endDrag(e: React.PointerEvent<HTMLDivElement>) {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    scheduleDim();
  }

  if (!enabled) return null;

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-2 z-40 hidden md:block"
      style={{ top: TRACK_MARGIN, bottom: TRACK_MARGIN, width: LINE_WIDTH }}
    >
      <div className="absolute inset-0 rounded-full bg-slate/15" />

      {/* Invisible grab handle — travels with the thumb, wider/taller than
          the visible line so users don't need to land exactly on it. */}
      <motion.div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 cursor-grab touch-none select-none active:cursor-grabbing"
        style={{ width: HANDLE_WIDTH, height: HANDLE_HEIGHT, y: posY }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerEnter={() => {
          if (dimTimer.current) clearTimeout(dimTimer.current);
          setActive(true);
        }}
        onPointerLeave={() => {
          if (!draggingRef.current) scheduleDim();
        }}
      >
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-brand"
          style={{ top: HANDLE_PAD, width: LINE_WIDTH, height: THUMB_HEIGHT }}
          animate={{
            opacity: prefersReducedMotion ? IDLE_OPACITY : active ? ACTIVE_OPACITY : IDLE_OPACITY,
            boxShadow: !prefersReducedMotion && scrolling ? GLOW_ON : GLOW_OFF,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
}

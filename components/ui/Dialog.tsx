"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onClose: () => void;
  titleId: string;
  children: React.ReactNode;
  className?: string;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

export function Dialog({ open, onClose, titleId, children, className }: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const lastFocused = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open) return;

    lastFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    focusable?.[0]?.focus();

    function onKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panel) {
        const items = Array.from(
          panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        );
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeydown);
    return () => {
      document.removeEventListener("keydown", onKeydown);
      document.body.style.overflow = "";
      lastFocused.current?.focus();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        // Outer: full-screen fixed layer. overflow-hidden keeps panel inside viewport.
        // py-4 on mobile gives breathing room at top/bottom; md:py-10 on desktop.
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden px-4 py-4 md:px-6 md:py-10"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            className="absolute inset-0 bg-ink/85"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/*
            Panel: flex-col so close button stays fixed at top and content scrolls below.
            max-h-[90vh] = safe fallback for all browsers.
            Inline maxHeight: 90dvh overrides max-h-[90vh] on browsers that support
            dvh (dynamic viewport height, accounts for mobile address bar / keyboard).
            If dvh is unknown the inline value is ignored and 90vh applies as fallback.
          */}
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative flex w-full max-w-4xl flex-col bg-[#161b1f] max-h-[90vh]",
              className
            )}
            style={{ maxHeight: "90dvh" }}
          >
            {/* Close button: z-10 keeps it above scrollable content at all times.
                Contrast boosted to bg-white/15 (was /10) for mobile visibility.
                44×44px touch target maintained. */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Zavřít okno"
              className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-paper transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-brand-deep"
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/*
              Content area: flex-1 + min-h-0 allows it to shrink within the panel's
              max-height constraint. overflow-y-auto makes content scroll here, not the
              page. overscroll-contain stops scroll from bleeding to body at boundaries.
              pt-16 (mobile) / md:pt-[4.5rem] (desktop) clears the absolute close button
              (button top-4 + height-11 = 60px; pt-16 = 64px gives 4px clearance).
              paddingBottom via inline style uses safe-area-inset-bottom for iPhone notch.
            */}
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-7 pt-16 md:p-12 md:pt-[4.5rem]"
              style={{ paddingBottom: "max(1.75rem, env(safe-area-inset-bottom))" }}
            >
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

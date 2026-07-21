"use client";

import * as React from "react";

/**
 * Wraps a form field and plays a brief shake (see .animate-shake in
 * globals.css) the moment its error transitions from absent to present.
 * Uses a class + onAnimationEnd instead of a key remount so the wrapped
 * input never loses focus/DOM identity mid-interaction.
 */
export function ShakeField({
  error,
  children,
}: {
  error: string | null;
  children: React.ReactNode;
}) {
  const [shaking, setShaking] = React.useState(false);
  const prevError = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (error && !prevError.current) {
      setShaking(true);
    }
    prevError.current = error;
  }, [error]);

  return (
    <div
      className={shaking ? "animate-shake" : undefined}
      onAnimationEnd={() => setShaking(false)}
    >
      {children}
    </div>
  );
}

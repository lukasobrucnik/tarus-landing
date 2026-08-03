import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely (handles conflicting utility
 * classes the way `clsx` alone cannot, e.g. "p-2" vs "p-4").
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Tiny neutral gray pixel — used as a `next/image` blur placeholder so lazy
// images cross-fade in on load instead of popping in abruptly once fetched
// (the "flicker" reported on mobile, especially iOS Safari).
export const IMAGE_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

import { cn } from "@/lib/utils";

type PlaceholderProps = {
  alt: string;
  variant?: 1 | 2 | 3;
  className?: string;
  tagClassName?: string;
  showTag?: boolean;
};

const variantStyles: Record<number, string> = {
  1: "",
  2: "[--ph-a:#3c4a47] [--ph-b:#161e1c]",
  3: "[--ph-a:#54483a] [--ph-b:#211a12]",
};

/**
 * Illustrative photo placeholder — NOT a real photo, not hot-linked
 * or scraped imagery. Renders an abstract warm gradient with a small
 * caption tag so reviewers never mistake it for final content.
 *
 * `alt` is still required and rendered for a screen-reader-only label,
 * matching the semantics a real <Image alt="..."> would have once
 * swapped in — this is the single point in the codebase to replace
 * with `next/image` when real photography is supplied.
 */
export function Placeholder({
  alt,
  variant,
  className,
  tagClassName,
  showTag = true,
}: PlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "ph-base relative flex items-end",
        variant ? variantStyles[variant] : "",
        className
      )}
      style={
        variant
          ? ({
              backgroundImage: `repeating-linear-gradient(115deg, rgba(245,242,236,0.05) 0px, rgba(245,242,236,0.05) 2px, transparent 2px, transparent 14px), linear-gradient(155deg, var(--ph-a) 0%, var(--ph-b) 100%)`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {showTag && (
        <span
          className={cn(
            "relative z-10 m-2.5 rounded bg-ink/45 px-2.5 py-1 text-[11px] tracking-wide text-paper/60",
            tagClassName
          )}
        >
          Placeholder — {alt}
        </span>
      )}
    </div>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  asChild?: false;
};

const base =
  "inline-flex items-center justify-center gap-2 font-label-md text-label-md uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const variants: Record<string, string> = {
  primary: "bg-brand text-ink px-8 py-4 hover:bg-brand-deep hover:scale-[1.02] active:scale-[0.98]",
  outline:
    "border border-slate/30 px-6 py-3 hover:border-brand hover:bg-brand/5 text-ink",
  ghost: "text-ink/80 hover:text-ink px-2 py-2",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

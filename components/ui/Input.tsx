import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full border border-slate/30 bg-white px-3.5 py-3 text-sm text-ink placeholder:text-slate/50 transition-colors focus-visible:outline-none focus-visible:border-brand-deep aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-danger",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none border border-slate/30 bg-white px-3.5 py-3 text-sm text-ink placeholder:text-slate/50 transition-colors focus-visible:outline-none focus-visible:border-brand-deep aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-danger",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

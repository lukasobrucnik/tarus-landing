"use client";

import { Button } from "@/components/ui/Button";
import { useContactModal } from "@/components/ContactModal";
import { cn } from "@/lib/utils";

export function CtaButton({
  children = "Poptat spolupráci",
  className,
  variant = "primary",
}: {
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
}) {
  const { open } = useContactModal();
  return (
    <Button type="button" variant={variant} onClick={open} className={cn(className)}>
      {children}
    </Button>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gi" | "nutrition" | "season";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "border-transparent bg-primary text-primary-foreground": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground": variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground": variant === "destructive",
          "text-foreground": variant === "outline",
          "border-transparent bg-amber-500/20 text-amber-700 dark:text-amber-300": variant === "gi",
          "border-transparent bg-emerald-500/20 text-emerald-700 dark:text-emerald-300": variant === "nutrition",
          "border-transparent bg-sky-500/20 text-sky-700 dark:text-sky-300": variant === "season",
        },
        className
      )}
      {...props}
    />
  );
}

export { Badge };

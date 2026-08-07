"use client";

import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/toast-context";

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/50",
  error: "border-red-500/50 bg-red-50 dark:bg-red-950/50",
  info: "border-blue-500/50 bg-blue-50 dark:bg-blue-950/50",
  warning: "border-amber-500/50 bg-amber-50 dark:bg-amber-950/50",
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "flex items-start gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-sm",
              colors[t.type]
            )}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">{t.title}</p>
              {t.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

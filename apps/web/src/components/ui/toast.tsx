"use client";

import * as React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useA11yTranslations } from "@/lib/i18n/use-a11y-translations";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  // Optional collision key. When two `addToast` calls land while a toast
  // with the same `dedupeKey` is still active, the second call is skipped
  // and the existing toast's id is returned. This is what keeps multiple
  // parallel fetch failures (opportunities list + settings + kanban)
  // from stacking three copies of the same "Failed to get settings"
  // error in the corner.
  dedupeKey?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">, durationMs?: number) => string;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (
      { type, title, description, dedupeKey, action }: Omit<Toast, "id">,
      durationMs = 5000,
    ) => {
      let assignedId = "";
      let isDuplicate = false;

      setToasts((prev) => {
        if (dedupeKey) {
          const existing = prev.find((t) => t.dedupeKey === dedupeKey);
          if (existing) {
            assignedId = existing.id;
            isDuplicate = true;
            return prev;
          }
        }
        assignedId = Math.random().toString(36).slice(2);
        return [
          ...prev,
          {
            id: assignedId,
            type,
            title,
            description,
            dedupeKey,
            action,
          },
        ];
      });

      // Only schedule a fresh auto-dismiss when we actually appended a new
      // toast. The original toast's timer is still in flight on a duplicate.
      if (durationMs > 0 && !isDuplicate) {
        const id = assignedId;
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, durationMs);
      }

      return assignedId;
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: "border-success/50 bg-success/10 text-success",
  error: "border-destructive/50 bg-destructive/10 text-destructive",
  warning: "border-warning/50 bg-warning/10 text-warning",
  info: "border-info/50 bg-info/10 text-info",
};

function ToastContainer() {
  const a11yT = useA11yTranslations();

  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "flex items-start gap-3 rounded-[var(--radius)] border-[length:var(--border-width)] p-4 shadow-[var(--shadow-elevated)] [backdrop-filter:var(--backdrop-blur)] animate-slide-in-right",
              toastStyles[toast.type],
            )}
          >
            <Icon className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-foreground [letter-spacing:var(--letter-spacing)]">
                {toast.title}
              </p>
              {toast.description && (
                <p className="mt-1 text-sm text-muted-foreground [letter-spacing:var(--letter-spacing)]">
                  {toast.description}
                </p>
              )}
              {toast.action && (
                <button
                  type="button"
                  onClick={() => {
                    toast.action?.onClick();
                    removeToast(toast.id);
                  }}
                  className="mt-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={a11yT("dismissNotification")}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export { ToastContainer };

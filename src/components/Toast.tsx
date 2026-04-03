"use client";

import { useCallback, useState } from "react";

export interface ToastItem {
  id: number;
  message: string;
  icon?: string;
  type?: "success" | "info" | "warning" | "error";
}

const typeStyles: Record<string, { bg: string; text: string; iconColor: string }> = {
  success: { bg: "bg-emerald-800", text: "text-white", iconColor: "text-emerald-300" },
  info: { bg: "bg-primary", text: "text-white", iconColor: "text-primary-fixed" },
  warning: { bg: "bg-orange-700", text: "text-white", iconColor: "text-orange-200" },
  error: { bg: "bg-error", text: "text-white", iconColor: "text-red-200" },
};

const defaultIcons: Record<string, string> = {
  success: "check_circle",
  info: "info",
  warning: "warning",
  error: "error",
};

let nextId = 0;

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastItem["type"] = "success", icon?: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}

export function ToastContainer({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: number) => void }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none">
      {toasts.map((toast) => {
        const style = typeStyles[toast.type || "success"];
        const icon = toast.icon || defaultIcons[toast.type || "success"];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl ${style.bg} ${style.text} animate-toast-in`}
          >
            <span
              aria-hidden="true"
              className={`material-symbols-outlined text-[20px] ${style.iconColor}`}
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {icon}
            </span>
            <span className="text-sm font-semibold">{toast.message}</span>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

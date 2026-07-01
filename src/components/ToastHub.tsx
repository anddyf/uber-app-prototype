"use client";

import { useEffect, useState } from "react";

type Toast = { id: number; msg: string; tone: "success" | "error" | "info" };

export default function ToastHub() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent).detail as { msg: string; tone?: Toast["tone"] };
      const t: Toast = { id: Date.now() + Math.random(), msg: detail.msg, tone: detail.tone ?? "info" };
      setToasts((prev) => [...prev, t]);
      setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== t.id)), 3200);
    }
    window.addEventListener("toast", onToast as any);
    return () => window.removeEventListener("toast", onToast as any);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="rounded-lg px-4 py-3 shadow-lg border card bg-[--color-surface]"
          style={{
            borderColor:
              t.tone === "success" ? "var(--color-success-500)" :
              t.tone === "error"   ? "var(--color-danger-500)"  :
                                     "var(--color-border)",
          }}
        >
          <span className={
            t.tone === "success" ? "text-success-500" :
            t.tone === "error"   ? "text-danger-500"  :
                                   "text-[--color-text]"
          }>
            {t.msg}
          </span>
        </div>
      ))}
    </div>
  );
}

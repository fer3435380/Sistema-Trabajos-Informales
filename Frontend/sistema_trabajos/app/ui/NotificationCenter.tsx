"use client";

import { useEffect, useRef, useState } from "react";
import { formatDate } from "../lib/formatters";
import { getStatusChipClasses } from "../lib/constants";
import type { NotificationItem } from "../types/job";

type NotificationCenterProps = {
  isLoading: boolean;
  notifications: NotificationItem[];
  unreadCount: number;
  onMarkAsRead: (notificationId: number) => void;
};

export function NotificationCenter({
  isLoading,
  notifications,
  unreadCount,
  onMarkAsRead,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Abrir notificaciones"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-[var(--blue-dark)] sm:h-12 sm:w-12"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 3a4 4 0 0 0-4 4v1.2c0 .9-.3 1.8-.8 2.6L5.8 13a3 3 0 0 0-.4 1.5V16h13.2v-1.5c0-.5-.1-1-.4-1.5l-1.4-2.2a4.9 4.9 0 0 1-.8-2.6V7a4 4 0 0 0-4-4Z"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M9.5 19a2.5 2.5 0 0 0 5 0"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[var(--orange)] px-1 text-[10px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <section
          aria-label="Panel de notificaciones"
          className="absolute left-0 top-[calc(100%+0.75rem)] z-30 grid max-h-[min(72vh,38rem)] w-[min(calc(100vw-2rem),24rem)] gap-4 overflow-hidden rounded-[24px] border border-slate-200 bg-white p-3 shadow-[0_28px_60px_rgba(15,23,42,0.2)] sm:left-auto sm:right-0 sm:w-[min(92vw,24rem)] sm:rounded-[28px] sm:p-4"
          role="dialog"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
                Alertas
              </p>
              <h2 className="text-xl font-black text-slate-950">
                Notificaciones
              </h2>
            </div>
            <span className="inline-flex min-h-8 items-center rounded-full bg-amber-100 px-3 text-xs font-black text-amber-800 ring-1 ring-amber-200">
              {unreadCount} nuevas
            </span>
          </div>

          {isLoading && notifications.length === 0 ? (
            <div className="flex min-h-28 items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-500">
              Cargando notificaciones...
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex min-h-28 items-center justify-center rounded-[22px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-500">
              Todavia no tienes notificaciones.
            </div>
          ) : (
            <div className="grid max-h-[20rem] gap-3 overflow-auto pr-1">
              {notifications.map((notification) => (
                <article
                  className={`grid gap-3 rounded-[22px] border p-4 ${
                    notification.is_read
                      ? "border-slate-200 bg-slate-50 opacity-80"
                      : "border-blue-200 bg-blue-50/60 shadow-[inset_3px_0_0_var(--blue)]"
                  }`}
                  key={notification.id}
                >
                  <div className="grid gap-2">
                    <span
                      className={`inline-flex min-h-7 w-fit items-center rounded-full px-2.5 text-[11px] font-black ${getStatusChipClasses(notification.is_read ? "closed" : "pending")}`}
                    >
                      {notification.is_read ? "Leida" : "Nueva"}
                    </span>
                    <strong className="text-sm font-black leading-6 text-slate-900">
                      {notification.message}
                    </strong>
                    <small className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      {formatDate(notification.created_at)}
                    </small>
                  </div>
                  {!notification.is_read ? (
                    <button
                      className="inline-flex min-h-10 w-full items-center justify-center rounded-2xl bg-emerald-100 px-4 text-sm font-black text-emerald-800 transition hover:bg-emerald-200"
                      onClick={() => onMarkAsRead(notification.id)}
                      type="button"
                    >
                      Marcar leida
                    </button>
                  ) : (
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">
                      Leida
                    </span>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}

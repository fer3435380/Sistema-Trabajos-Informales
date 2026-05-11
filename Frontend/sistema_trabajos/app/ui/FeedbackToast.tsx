"use client";

import type { Feedback } from "../types/job";

type FeedbackToastProps = {
  feedback: Feedback | null;
  onClose: () => void;
};

export function FeedbackToast({ feedback, onClose }: FeedbackToastProps) {
  if (!feedback) {
    return null;
  }

  return (
    <div
      className={`fixed inset-x-4 bottom-4 z-[60] grid grid-cols-[1fr_auto] gap-3 rounded-[24px] border border-white/15 p-4 text-white shadow-[0_22px_40px_rgba(15,23,42,0.22)] backdrop-blur md:inset-x-auto md:right-6 md:w-full md:max-w-sm ${
        feedback.tone === "success"
          ? "bg-emerald-600/95"
          : feedback.tone === "error"
            ? "bg-rose-600/95"
            : "bg-blue-700/95"
      }`}
      role="status"
    >
      <div className="grid gap-1">
        <strong className="text-xs font-black uppercase tracking-[0.18em]">
          {feedback.tone === "error" ? "Atencion" : "Aviso"}
        </strong>
        <span className="text-sm font-bold leading-6">{feedback.message}</span>
      </div>
      <button
        aria-label="Cerrar aviso"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-base font-black text-white/90 transition hover:bg-white/10"
        onClick={onClose}
        type="button"
      >
        x
      </button>
    </div>
  );
}

import { getStatusChipClasses, statusLabels } from "../lib/constants";
import { formatDate } from "../lib/formatters";
import type { Application } from "../types/job";

type ApplicationModalProps = {
  application: Application;
  onClose: () => void;
};

export function ApplicationModal({
  application,
  onClose,
}: ApplicationModalProps) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <article
        aria-modal="true"
        className="grid w-full max-w-xl gap-5 rounded-t-[32px] border border-slate-200 bg-white p-4 pb-5 shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:rounded-[28px] sm:p-5"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
              Detalle
            </p>
            <h2 className="text-2xl font-black text-slate-950">
              {application.job_title ?? `Trabajo ${application.job}`}
            </h2>
          </div>
          <button
            aria-label="Cerrar detalle"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-600 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>
        <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[8rem_1fr]">
          <span className="text-sm font-bold text-slate-500">Estado</span>
          <strong
            className={`inline-flex min-h-8 w-fit items-center rounded-full px-3 text-xs font-black ${getStatusChipClasses(application.status)}`}
          >
            {statusLabels[application.status]}
          </strong>
          <span className="text-sm font-bold text-slate-500">Fecha</span>
          <strong className="text-sm font-black text-slate-900">
            {formatDate(application.created_at)}
          </strong>
          <span className="text-sm font-bold text-slate-500">ID trabajo</span>
          <strong className="text-sm font-black text-slate-900">
            {application.job}
          </strong>
        </div>
        <div className="grid gap-2">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
            Mensaje enviado
          </p>
          <p className="text-sm leading-7 text-slate-600">
            {application.cover_letter || "Sin mensaje de postulacion."}
          </p>
        </div>
      </article>
    </div>
  );
}

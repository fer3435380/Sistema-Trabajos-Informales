import { JobForm } from "./JobForm";
import type { FormSubmitHandler, JobForm as JobFormValues } from "../types/job";

type JobFormModalProps = {
  form: JobFormValues;
  isWorking: boolean;
  onChange: (form: JobFormValues) => void;
  onClose: () => void;
  onSubmit: FormSubmitHandler;
};

export function JobFormModal({
  form,
  isWorking,
  onChange,
  onClose,
  onSubmit,
}: JobFormModalProps) {
  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="presentation"
    >
      <article
        aria-modal="true"
        className="grid max-h-[min(100dvh-0.5rem,48rem)] w-full max-w-2xl gap-5 overflow-auto rounded-t-[32px] border border-slate-200 bg-white p-4 pb-5 shadow-[0_30px_90px_rgba(15,23,42,0.28)] sm:max-h-[92vh] sm:rounded-[28px] sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
              Nueva publicacion
            </p>
            <h2 className="text-2xl font-black text-slate-950">
              Publicar trabajo
            </h2>
          </div>
          <button
            aria-label="Cerrar formulario"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-sm font-black text-slate-600 transition hover:bg-slate-200"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>
        <JobForm
          form={form}
          isWorking={isWorking}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </article>
    </div>
  );
}

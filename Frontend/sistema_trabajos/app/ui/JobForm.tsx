import type { FormSubmitHandler, JobForm as JobFormValues } from "../types/job";

type JobFormProps = {
  form: JobFormValues;
  isWorking: boolean;
  onChange: (form: JobFormValues) => void;
  onSubmit: FormSubmitHandler;
};

export function JobForm({
  form,
  isWorking,
  onChange,
  onSubmit,
}: JobFormProps) {
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
      <p className="text-sm font-semibold leading-6 text-slate-500 sm:col-span-2">
        Completa los datos del trabajo para publicarlo.
      </p>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Titulo
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) => onChange({ ...form, title: event.target.value })}
          required
          value={form.title}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Tipo
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) => onChange({ ...form, type: event.target.value })}
          required
          value={form.type}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Ubicacion
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) =>
            onChange({ ...form, location: event.target.value })
          }
          required
          value={form.location}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700">
        Pago
        <input
          className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          min="0"
          onChange={(event) =>
            onChange({ ...form, payment: event.target.value })
          }
          required
          step="0.01"
          type="number"
          value={form.payment}
        />
      </label>
      <label className="grid gap-2 text-sm font-extrabold text-slate-700 sm:col-span-2">
        Descripcion
        <textarea
          className="min-h-32 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:text-sm"
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
          }
          required
          rows={4}
          value={form.description}
        />
      </label>
      <button
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--orange)] px-4 text-sm font-black text-white shadow-[0_18px_40px_rgba(251,114,22,0.24)] transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
        disabled={isWorking}
      >
        <span aria-hidden="true">+</span>
        Publicar
      </button>
    </form>
  );
}

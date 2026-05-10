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
    <form className="panel" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Duenos</p>
        <h2>Publicar trabajo</h2>
      </div>
      <label>
        Titulo
        <input
          onChange={(event) => onChange({ ...form, title: event.target.value })}
          required
          value={form.title}
        />
      </label>
      <label>
        Tipo
        <input
          onChange={(event) => onChange({ ...form, type: event.target.value })}
          required
          value={form.type}
        />
      </label>
      <label>
        Ubicacion
        <input
          onChange={(event) =>
            onChange({ ...form, location: event.target.value })
          }
          required
          value={form.location}
        />
      </label>
      <label>
        Pago
        <input
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
      <label>
        Descripcion
        <textarea
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
          }
          required
          rows={4}
          value={form.description}
        />
      </label>
      <button className="btn btn-accent w-full" disabled={isWorking}>
        <span aria-hidden="true">+</span>
        Publicar
      </button>
    </form>
  );
}

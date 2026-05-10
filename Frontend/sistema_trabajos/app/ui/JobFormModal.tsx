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
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <article
        aria-modal="true"
        className="floating-card job-form-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="panel-title">
          <div>
            <p className="eyebrow">Nueva publicacion</p>
            <h2>Publicar trabajo</h2>
          </div>
          <button
            aria-label="Cerrar formulario"
            className="icon-button"
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

import { statusLabels } from "../lib/constants";
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
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <article
        aria-modal="true"
        className="floating-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="panel-title">
          <div>
            <p className="eyebrow">Detalle</p>
            <h2>{application.job_title ?? `Trabajo ${application.job}`}</h2>
          </div>
          <button
            aria-label="Cerrar detalle"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>
        <div className="detail-grid">
          <span>Estado</span>
          <strong>{statusLabels[application.status]}</strong>
          <span>Fecha</span>
          <strong>{formatDate(application.created_at)}</strong>
          <span>ID trabajo</span>
          <strong>{application.job}</strong>
        </div>
        <div>
          <p className="eyebrow">Mensaje enviado</p>
          <p className="job-description">
            {application.cover_letter || "Sin mensaje de postulacion."}
          </p>
        </div>
      </article>
    </div>
  );
}

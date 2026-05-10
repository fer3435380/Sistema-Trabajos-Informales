import { statusLabels } from "../lib/constants";
import { formatDate } from "../lib/formatters";
import type { Application } from "../types/job";

type ApplicationCardsProps = {
  applications: Application[];
  compact?: boolean;
  onSelectApplication: (application: Application) => void;
};

export function ApplicationCards({
  applications,
  compact = false,
  onSelectApplication,
}: ApplicationCardsProps) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        Todavia no tienes postulaciones. Explora los trabajos disponibles.
      </div>
    );
  }

  return (
    <div className={compact ? "application-grid compact" : "application-grid"}>
      {applications.slice(0, 4).map((application) => (
        <button
          className="application-card"
          key={application.id}
          onClick={() => onSelectApplication(application)}
          type="button"
        >
          <span className={`status-chip ${application.status}`}>
            {statusLabels[application.status]}
          </span>
          <strong>{application.job_title ?? `Trabajo ${application.job}`}</strong>
          <small>{formatDate(application.created_at)}</small>
        </button>
      ))}
    </div>
  );
}

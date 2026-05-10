import { statusLabels } from "../lib/constants";
import type { Application } from "../types/job";

type ReceivedApplicationsProps = {
  applications: Application[];
  isWorking: boolean;
  onStatusChange: (applicationId: number, status: "accept" | "reject") => void;
};

export function ReceivedApplications({
  applications,
  isWorking,
  onStatusChange,
}: ReceivedApplicationsProps) {
  return (
    <section className="panel">
      <div>
        <p className="eyebrow">Gestion</p>
        <h2>Postulaciones recibidas</h2>
      </div>

      {applications.length === 0 ? (
        <p className="muted">Todavia no hay postulantes.</p>
      ) : (
        <div className="received-list">
          {applications.map((application) => (
            <article className="received-row" key={application.id}>
              <div>
                <strong>{application.applicant_name ?? "Postulante"}</strong>
                <span>{application.job_title}</span>
                {application.cover_letter ? (
                  <p>{application.cover_letter}</p>
                ) : null}
              </div>
              <div className="received-actions">
                <span className={`status-chip ${application.status}`}>
                  {statusLabels[application.status]}
                </span>
                <button
                  aria-label="Aceptar postulacion"
                  className="icon-button accept"
                  disabled={isWorking || application.status !== "pending"}
                  onClick={() => onStatusChange(application.id, "accept")}
                  title="Aceptar"
                  type="button"
                >
                  OK
                </button>
                <button
                  aria-label="Rechazar postulacion"
                  className="icon-button reject"
                  disabled={isWorking || application.status !== "pending"}
                  onClick={() => onStatusChange(application.id, "reject")}
                  title="Rechazar"
                  type="button"
                >
                  X
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

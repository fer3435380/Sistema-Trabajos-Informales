import { statusLabels } from "../lib/constants";
import { formatDate, formatMoney } from "../lib/formatters";
import type { Job } from "../types/job";

type OwnerJobListProps = {
  isLoading: boolean;
  jobs: Job[];
};

export function OwnerJobList({ isLoading, jobs }: OwnerJobListProps) {
  if (isLoading) {
    return <div className="empty-state">Cargando publicaciones...</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="empty-state">
        Aun no tienes publicaciones con esos filtros.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {jobs.map((job) => (
        <article className="job-card owner-job-card" key={job.id}>
          <div className="job-card-top">
            <div>
              <p className="eyebrow">{job.type}</p>
              <h3>{job.title}</h3>
            </div>
            <span className={`status-chip ${job.status}`}>
              {statusLabels[job.status]}
            </span>
          </div>
          <p className="job-description">{job.description}</p>
          <div className="job-meta">
            <span>{job.location}</span>
            <span>{formatMoney(job.payment)}</span>
            <span>{formatDate(job.created_at)}</span>
          </div>
          <div className="creator-row">
            <span className="avatar">
              {(job.creator_name || "ST").slice(0, 2).toUpperCase()}
            </span>
            <span>{job.creator_name || "Publicador"}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

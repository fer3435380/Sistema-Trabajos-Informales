import { statusLabels } from "../lib/constants";
import { formatDate, formatMoney } from "../lib/formatters";
import type { Job } from "../types/job";

type DashboardJobCardProps = {
  applied: boolean;
  coverLetter: string;
  isWorking: boolean;
  job: Job;
  onApply: (jobId: number) => void;
  onCoverLetterChange: (value: string) => void;
};

export function DashboardJobCard({
  applied,
  coverLetter,
  isWorking,
  job,
  onApply,
  onCoverLetterChange,
}: DashboardJobCardProps) {
  return (
    <article className="job-card apply-hover-card">
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
      <textarea
        onChange={(event) => onCoverLetterChange(event.target.value)}
        placeholder="Mensaje de postulacion"
        rows={3}
        value={coverLetter}
      />
      <button
        className={`apply-btn ${
          applied ? "btn btn-soft w-full" : "btn btn-primary w-full"
        }`}
        disabled={isWorking || applied || job.status !== "open"}
        onClick={() => onApply(job.id)}
        type="button"
      >
        <span aria-hidden="true">{applied ? "OK" : ">"}</span>
        {applied ? "Postulado" : "Postularme"}
      </button>
    </article>
  );
}

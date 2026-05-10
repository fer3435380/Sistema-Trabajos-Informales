import { formatMoney } from "../lib/formatters";
import type { Job } from "../types/job";

type PublicJobCardProps = {
  job: Job;
  onClick: () => void;
};

export function PublicJobCard({ job, onClick }: PublicJobCardProps) {
  return (
    <button className="public-job-card" onClick={onClick} type="button">
      <span className="eyebrow">{job.type}</span>
      <strong>{job.title}</strong>
      <span>{job.location}</span>
      <small>{formatMoney(job.payment)}</small>
    </button>
  );
}

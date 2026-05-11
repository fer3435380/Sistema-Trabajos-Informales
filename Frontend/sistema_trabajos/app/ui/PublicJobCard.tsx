import { formatMoney } from "../lib/formatters";
import type { Job } from "../types/job";

type PublicJobCardProps = {
  job: Job;
  onClick: () => void;
};

export function PublicJobCard({ job, onClick }: PublicJobCardProps) {
  return (
    <button
      className="grid min-h-44 gap-3 rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-[0_20px_50px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(47,110,232,0.14)]"
      onClick={onClick}
      type="button"
    >
      <span className="text-xs font-black uppercase tracking-[0.18em] text-[var(--orange)]">
        {job.type}
      </span>
      <strong className="text-lg font-black leading-tight text-slate-950">
        {job.title}
      </strong>
      <span className="text-sm font-semibold text-slate-500">
        {job.location}
      </span>
      <small className="text-sm font-black text-[var(--orange)]">
        {formatMoney(job.payment)}
      </small>
    </button>
  );
}

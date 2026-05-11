import { getStatusChipClasses, statusLabels } from "../lib/constants";
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
    <article className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_24px_60px_rgba(47,110,232,0.12)] sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--orange)]">
            {job.type}
          </p>
          <h3 className="mt-1 text-xl font-black leading-tight text-slate-950">
            {job.title}
          </h3>
        </div>
        <span
          className={`inline-flex min-h-8 shrink-0 items-center rounded-full px-3 text-xs font-black ${getStatusChipClasses(job.status)}`}
        >
          {statusLabels[job.status]}
        </span>
      </div>
      <p className="text-sm leading-7 text-slate-600">{job.description}</p>
      <div className="flex flex-wrap gap-2">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {job.location}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {formatMoney(job.payment)}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {formatDate(job.created_at)}
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-3 text-sm font-bold text-slate-700">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--blue)] text-xs font-black text-white">
          {(job.creator_name || "ST").slice(0, 2).toUpperCase()}
        </span>
        <span className="truncate">{job.creator_name || "Publicador"}</span>
      </div>
      <textarea
        className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 sm:min-h-28 sm:text-sm"
        onChange={(event) => onCoverLetterChange(event.target.value)}
        placeholder="Mensaje de postulacion"
        rows={3}
        value={coverLetter}
      />
      <button
        className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 text-sm font-black transition ${
          applied
            ? "bg-emerald-100 text-emerald-800"
            : "border border-blue-700/10 bg-[var(--blue)] text-white hover:bg-[#2a62cf]"
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

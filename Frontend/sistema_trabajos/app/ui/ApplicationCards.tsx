import { getStatusChipClasses, statusLabels } from "../lib/constants";
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
      <div className="flex min-h-36 items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-500">
        Todavia no tienes postulaciones. Explora los trabajos disponibles.
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "grid grid-cols-1 gap-3"
          : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      }
    >
      {applications.slice(0, 4).map((application) => (
        <button
          className="grid min-h-32 gap-3 rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-amber-200 sm:min-h-36"
          key={application.id}
          onClick={() => onSelectApplication(application)}
          type="button"
        >
          <span
            className={`inline-flex min-h-8 w-fit items-center rounded-full px-3 text-xs font-black ${getStatusChipClasses(application.status)}`}
          >
            {statusLabels[application.status]}
          </span>
          <strong className="text-base font-black leading-tight text-slate-950 sm:text-lg">
            {application.job_title ?? `Trabajo ${application.job}`}
          </strong>
          <small className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
            {formatDate(application.created_at)}
          </small>
        </button>
      ))}
    </div>
  );
}

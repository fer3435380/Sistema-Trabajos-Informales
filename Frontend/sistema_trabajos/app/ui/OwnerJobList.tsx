"use client";

import { useMemo, useState } from "react";
import { getStatusChipClasses, statusLabels } from "../lib/constants";
import { formatDate, formatMoney } from "../lib/formatters";
import { PaginationControls } from "./PaginationControls";
import type { Job } from "../types/job";

const OWNER_JOBS_PER_PAGE = 6;

type OwnerJobListProps = {
  isLoading: boolean;
  jobs: Job[];
};

export function OwnerJobList({ isLoading, jobs }: OwnerJobListProps) {
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(jobs.length / OWNER_JOBS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * OWNER_JOBS_PER_PAGE;
    return jobs.slice(startIndex, startIndex + OWNER_JOBS_PER_PAGE);
  }, [currentPage, jobs]);

  if (isLoading) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-500">
        Cargando publicaciones...
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-4 text-center text-sm font-semibold text-slate-500">
        Aun no tienes publicaciones con esos filtros.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {paginatedJobs.map((job) => (
          <article
            className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-5"
            key={job.id}
          >
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
          </article>
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        itemLabel="publicaciones"
        onPageChange={setRequestedPage}
        pageSize={OWNER_JOBS_PER_PAGE}
        totalItems={jobs.length}
      />
    </div>
  );
}

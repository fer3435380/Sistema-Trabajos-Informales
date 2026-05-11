"use client";

import { useMemo, useState } from "react";
import { getStatusChipClasses, statusLabels } from "../lib/constants";
import { PaginationControls } from "./PaginationControls";
import type { Application } from "../types/job";

const RECEIVED_APPLICATIONS_PER_PAGE = 5;

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
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = Math.max(
    1,
    Math.ceil(applications.length / RECEIVED_APPLICATIONS_PER_PAGE),
  );
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedApplications = useMemo(() => {
    const startIndex = (currentPage - 1) * RECEIVED_APPLICATIONS_PER_PAGE;
    return applications.slice(
      startIndex,
      startIndex + RECEIVED_APPLICATIONS_PER_PAGE,
    );
  }, [applications, currentPage]);

  return (
    <section className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--orange)]">
          Gestion
        </p>
        <h2 className="text-2xl font-black text-slate-950">
          Postulaciones recibidas
        </h2>
      </div>

      {applications.length === 0 ? (
        <p className="text-sm font-semibold text-slate-500">
          Todavia no hay postulantes.
        </p>
      ) : (
        <div className="grid gap-4">
          <div className="grid gap-3">
            {paginatedApplications.map((application) => (
              <article
                className="grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                key={application.id}
              >
                <div className="grid gap-2">
                  <strong className="text-base font-black text-slate-900">
                    {application.applicant_name ?? "Postulante"}
                  </strong>
                  <span className="text-sm font-semibold text-slate-500">
                    {application.job_title}
                  </span>
                  {application.cover_letter ? (
                    <p className="text-sm leading-6 text-slate-600">
                      {application.cover_letter}
                    </p>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-end">
                  <span
                    className={`col-span-2 inline-flex min-h-8 items-center justify-center rounded-full px-3 text-xs font-black sm:col-span-1 ${getStatusChipClasses(application.status)}`}
                  >
                    {statusLabels[application.status]}
                  </span>
                  <button
                    aria-label="Aceptar postulacion"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-emerald-100 px-4 text-sm font-black text-emerald-800 transition hover:bg-emerald-200 disabled:opacity-60"
                    disabled={isWorking || application.status !== "pending"}
                    onClick={() => onStatusChange(application.id, "accept")}
                    title="Aceptar"
                    type="button"
                  >
                    Aceptar
                  </button>
                  <button
                    aria-label="Rechazar postulacion"
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-rose-100 px-4 text-sm font-black text-rose-800 transition hover:bg-rose-200 disabled:opacity-60"
                    disabled={isWorking || application.status !== "pending"}
                    onClick={() => onStatusChange(application.id, "reject")}
                    title="Rechazar"
                    type="button"
                  >
                    Rechazar
                  </button>
                </div>
              </article>
            ))}
          </div>
          <PaginationControls
            currentPage={currentPage}
            itemLabel="postulaciones"
            onPageChange={setRequestedPage}
            pageSize={RECEIVED_APPLICATIONS_PER_PAGE}
            totalItems={applications.length}
          />
        </div>
      )}
    </section>
  );
}

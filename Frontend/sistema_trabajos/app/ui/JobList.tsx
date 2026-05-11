"use client";

import { useMemo, useState } from "react";
import { DashboardJobCard } from "./DashboardJobCard";
import { PaginationControls } from "./PaginationControls";
import type { Job } from "../types/job";

const JOBS_PER_PAGE = 6;

type JobListProps = {
  appliedJobIds: Set<number>;
  coverLetters: Record<number, string>;
  isLoading: boolean;
  isWorking: boolean;
  jobs: Job[];
  onApply: (jobId: number) => void;
  onCoverLetterChange: (jobId: number, value: string) => void;
};

export function JobList({
  appliedJobIds,
  coverLetters,
  isLoading,
  isWorking,
  jobs,
  onApply,
  onCoverLetterChange,
}: JobListProps) {
  const [requestedPage, setRequestedPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PER_PAGE));
  const currentPage = Math.min(requestedPage, totalPages);
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    return jobs.slice(startIndex, startIndex + JOBS_PER_PAGE);
  }, [currentPage, jobs]);

  if (isLoading) {
    return <div className="empty-state">Cargando trabajos...</div>;
  }

  if (jobs.length === 0) {
    return <div className="empty-state">No hay trabajos con esos filtros.</div>;
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-2">
        {paginatedJobs.map((job) => (
          <DashboardJobCard
            applied={appliedJobIds.has(job.id)}
            coverLetter={coverLetters[job.id] ?? ""}
            isWorking={isWorking}
            job={job}
            key={job.id}
            onApply={onApply}
            onCoverLetterChange={(value) => onCoverLetterChange(job.id, value)}
          />
        ))}
      </div>
      <PaginationControls
        currentPage={currentPage}
        itemLabel="trabajos"
        onPageChange={setRequestedPage}
        pageSize={JOBS_PER_PAGE}
        totalItems={jobs.length}
      />
    </div>
  );
}

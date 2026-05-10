import { DashboardJobCard } from "./DashboardJobCard";
import type { Job } from "../types/job";

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
  if (isLoading) {
    return <div className="empty-state">Cargando trabajos...</div>;
  }

  if (jobs.length === 0) {
    return <div className="empty-state">No hay trabajos con esos filtros.</div>;
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {jobs.map((job) => (
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
  );
}

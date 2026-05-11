import { ApplicationCards } from "./ApplicationCards";
import { JobFilters } from "./JobFilters";
import { getRoleBadgeClasses, roleLabels } from "../lib/constants";
import type { Application, Filters, User } from "../types/job";

type UserSidebarProps = {
  applications: Application[];
  filters: Filters;
  isLoading: boolean;
  user: User;
  onFilterChange: (filters: Filters) => void;
  onRefresh: () => void;
  onSelectApplication: (application: Application) => void;
};

export function UserSidebar({
  applications,
  filters,
  isLoading,
  user,
  onFilterChange,
  onRefresh,
  onSelectApplication,
}: UserSidebarProps) {
  const isOwner = user.role === "owner" || user.role === "admin";

  return (
    <aside className="grid h-fit self-start gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_18px_40px_rgba(15,23,42,0.06)] sm:p-5 xl:sticky xl:top-4">
      <div className="flex items-start gap-3 sm:items-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--blue)] text-sm font-black text-white">
          {user.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--orange)]">
            Usuario
          </p>
          <h2 className="text-xl font-black text-slate-950">{user.name}</h2>
          <p className="break-all text-sm font-semibold text-slate-500">
            {user.email}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
        <span className="text-sm font-semibold text-slate-500">Rol</span>
        <strong
          className={`inline-flex min-h-8 items-center rounded-full px-3 text-xs font-black ${getRoleBadgeClasses(user.role)}`}
        >
          {roleLabels[user.role]}
        </strong>
      </div>
      {!isOwner ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3">
            <span className="text-sm font-semibold text-slate-500">
              Postulaciones
            </span>
            <strong className="text-lg font-black text-slate-950">
              {applications.length}
            </strong>
          </div>
          <div className="grid gap-3 border-t border-slate-200 pt-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--orange)]">
                  Resumen
                </p>
                <h2 className="text-xl font-black text-slate-950">
                  Mis postulaciones
                </h2>
              </div>
            </div>
            <ApplicationCards
              applications={applications}
              compact
              onSelectApplication={onSelectApplication}
            />
          </div>
        </>
      ) : null}
      <div className="grid gap-4 border-t border-slate-200 pt-4">
        <JobFilters
          embedded
          filters={filters}
          isLoading={isLoading}
          onChange={onFilterChange}
          onRefresh={onRefresh}
        />
      </div>
    </aside>
  );
}

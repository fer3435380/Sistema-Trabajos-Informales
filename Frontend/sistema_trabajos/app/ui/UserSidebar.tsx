import { ApplicationCards } from "./ApplicationCards";
import { JobFilters } from "./JobFilters";
import { roleLabels, statusLabels } from "../lib/constants";
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
  return (
    <aside className="sidebar-panel">
      <div className="sidebar-user">
        <span className="avatar avatar-large">
          {user.name.slice(0, 2).toUpperCase()}
        </span>
        <div>
          <p className="eyebrow">Usuario</p>
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
        </div>
      </div>
      <div className="sidebar-detail">
        <span>Rol</span>
        <strong>{roleLabels[user.role]}</strong>
      </div>
      <div className="sidebar-detail">
        <span>Postulaciones</span>
        <strong>{applications.length}</strong>
      </div>
      <div className="sidebar-section">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Resumen</p>
            <h2>Mis postulaciones</h2>
          </div>
        </div>
        <ApplicationCards
          applications={applications}
          compact
          onSelectApplication={onSelectApplication}
        />
      </div>
      <div className="sidebar-section">
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

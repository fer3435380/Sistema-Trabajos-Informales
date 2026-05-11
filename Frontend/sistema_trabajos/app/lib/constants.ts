import type { Application, Filters, Job, Role } from "../types/job";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const emptyFilters: Filters = {
  search: "",
  type: "",
  location: "",
  status: "open",
};

export const emptyJobForm = {
  title: "",
  type: "",
  location: "",
  payment: "",
  description: "",
};

export const statusLabels: Record<Job["status"] | Application["status"], string> =
  {
    open: "Abierto",
    assigned: "Asignado",
    closed: "Cerrado",
    pending: "Pendiente",
    accepted: "Aceptada",
    rejected: "Rechazada",
  };

export const roleLabels: Record<Role, string> = {
  worker: "Trabajador",
  owner: "Propietario",
  admin: "Administrador",
};

export function getStatusChipClasses(
  status: Job["status"] | Application["status"],
) {
  if (status === "open" || status === "accepted") {
    return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200";
  }

  if (status === "rejected") {
    return "bg-rose-100 text-rose-800 ring-1 ring-rose-200";
  }

  if (status === "closed") {
    return "bg-slate-200 text-slate-700 ring-1 ring-slate-300";
  }

  return "bg-amber-100 text-amber-800 ring-1 ring-amber-200";
}

export function getRoleBadgeClasses(role: Role) {
  if (role === "owner") {
    return "bg-amber-100 text-amber-900 ring-1 ring-amber-200";
  }

  if (role === "admin") {
    return "bg-slate-900 text-white";
  }

  return "bg-blue-100 text-blue-900 ring-1 ring-blue-200";
}

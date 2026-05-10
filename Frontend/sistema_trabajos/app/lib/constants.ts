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
  owner: "Dueno",
  admin: "Administrador",
};

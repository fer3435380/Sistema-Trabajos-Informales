import { API_BASE } from "./constants";
import type { AuthResponse, Filters, User } from "../types/job";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail =
      typeof data.detail === "string"
        ? data.detail
        : Object.values(data).flat().join(" ");
    throw new Error(detail || "No se pudo completar la solicitud.");
  }

  return data as T;
}

export function readSession() {
  const storedToken = window.localStorage.getItem("sti_token");
  const storedUser = window.localStorage.getItem("sti_user");

  if (!storedToken || !storedUser) {
    return null;
  }

  return {
    token: storedToken,
    user: JSON.parse(storedUser) as User,
  };
}

export function persistSession(data: AuthResponse) {
  window.localStorage.setItem("sti_token", data.access_token);
  window.localStorage.setItem("sti_user", JSON.stringify(data.user));
}

export function clearSession() {
  window.localStorage.removeItem("sti_token");
  window.localStorage.removeItem("sti_user");
}

export function buildJobQuery(filters: Filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim()) {
      params.set(key, value.trim());
    }
  });

  return params.toString();
}

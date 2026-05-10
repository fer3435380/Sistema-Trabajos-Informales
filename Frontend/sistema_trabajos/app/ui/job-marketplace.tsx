"use client";

import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Role = "worker" | "owner" | "admin";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type Job = {
  id: number;
  title: string;
  description: string;
  type: string;
  location: string;
  payment: string;
  creator_name: string;
  status: "open" | "assigned" | "closed";
  created_at: string;
};

type Application = {
  id: number;
  job: number;
  job_title?: string;
  applicant_name?: string;
  status: "pending" | "accepted" | "rejected";
  cover_letter: string;
  created_at: string;
};

type AuthResponse = {
  access_token: string;
  user: User;
};

type Feedback = {
  tone: "success" | "error" | "info";
  message: string;
};

type Filters = {
  search: string;
  type: string;
  location: string;
  status: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

const emptyFilters: Filters = {
  search: "",
  type: "",
  location: "",
  status: "open",
};

const statusLabels: Record<Job["status"] | Application["status"], string> = {
  open: "Abierto",
  assigned: "Asignado",
  closed: "Cerrado",
  pending: "Pendiente",
  accepted: "Aceptada",
  rejected: "Rechazada",
};

const roleLabels: Record<Role, string> = {
  worker: "Trabajador",
  owner: "Dueno",
  admin: "Administrador",
};

async function apiRequest<T>(
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

function readSession() {
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

function persistSession(data: AuthResponse) {
  window.localStorage.setItem("sti_token", data.access_token);
  window.localStorage.setItem("sti_user", JSON.stringify(data.user));
}

function clearSession() {
  window.localStorage.removeItem("sti_token");
  window.localStorage.removeItem("sti_user");
}

function buildJobQuery(filters: Filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value.trim()) {
      params.set(key, value.trim());
    }
  });

  return params.toString();
}

function formatMoney(value: string) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(Number(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function LoginLanding() {
  const router = useRouter();
  const loginRef = useRef<HTMLDivElement>(null);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "worker" as Role,
  });
  const [isWorking, setIsWorking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    tone: "info",
    message: "Ingresa para postular o publicar trabajos.",
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = readSession();
      if (session) {
        router.replace("/dashboard");
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router]);

  useEffect(() => {
    const timeout = window.setTimeout(async () => {
      try {
        const jobs = await apiRequest<Job[]>("/jobs/?status=open");
        setRecentJobs(jobs.slice(0, 6));
      } catch {
        setRecentJobs([]);
      }
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsWorking(true);

    const body =
      authMode === "register"
        ? authForm
        : { email: authForm.email, password: authForm.password };

    try {
      const data = await apiRequest<AuthResponse>(
        `/auth/${authMode}/`,
        { method: "POST", body: JSON.stringify(body) },
      );
      persistSession(data);
      setFeedback({
        tone: "success",
        message: `Bienvenido, ${data.user.name}.`,
      });
      router.push("/dashboard");
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo iniciar sesion.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  function handleRecentJobClick() {
    loginRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setFeedback({
      tone: "info",
      message: "Inicia sesion para postular a un trabajo.",
    });
  }

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--ink)]">
      <section className="hero-band">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-8 md:grid-cols-[1.05fr_0.95fr] md:px-8 lg:px-10">
          <div className="flex min-h-[390px] flex-col justify-between py-6">
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <span className="brand-mark">STI</span>
                <span className="pill pill-blue">Azul + Naranja</span>
                <span className="text-sm font-semibold text-slate-600">
                  Confianza · Profesional · Energia
                </span>
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 md:text-6xl">
                Sistema de trabajos informales
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
                Encuentra oportunidades recientes, inicia sesion y gestiona tus
                postulaciones con el backend del proyecto.
              </p>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3">
              <Metric label="Backend" value="API" />
              <Metric label="Trabajos recientes" value={recentJobs.length.toString()} />
              <Metric label="Sesion" value="JWT" />
            </div>
          </div>

          <div ref={loginRef}>
            <AuthPanel
              authForm={authForm}
              authMode={authMode}
              feedback={feedback}
              isWorking={isWorking}
              onAuthFormChange={setAuthForm}
              onAuthModeChange={setAuthMode}
              onSubmit={handleAuthSubmit}
            />
          </div>
        </div>
      </section>

      <MissionVision />

      <section className="mx-auto w-full max-w-7xl px-5 py-10 md:px-8 lg:px-10">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Recientes</p>
            <h2>Trabajos disponibles</h2>
          </div>
          <span className="status-message info">Solo vista informativa</span>
        </div>

        {recentJobs.length === 0 ? (
          <div className="empty-state mt-5">
            No se pudieron cargar trabajos recientes.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentJobs.map((job) => (
              <button
                className="public-job-card"
                key={job.id}
                onClick={handleRecentJobClick}
                type="button"
              >
                <span className="eyebrow">{job.type}</span>
                <strong>{job.title}</strong>
                <span>{job.location}</span>
                <small>{formatMoney(job.payment)}</small>
              </button>
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
          <span>Sistema de Trabajos Informales</span>
          <span>Proyecto academico · Django REST · Next.js</span>
        </div>
      </footer>
    </main>
  );
}

export function DashboardApp() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [receivedApplications, setReceivedApplications] = useState<
    Application[]
  >([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [debouncedFilters, setDebouncedFilters] =
    useState<Filters>(emptyFilters);
  const [coverLetters, setCoverLetters] = useState<Record<number, string>>({});
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [jobForm, setJobForm] = useState({
    title: "",
    type: "",
    location: "",
    payment: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isWorking, setIsWorking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({
    tone: "info",
    message: "Sincronizando panel.",
  });

  const isOwner = user?.role === "owner" || user?.role === "admin";
  const appliedJobIds = useMemo(
    () => new Set(myApplications.map((application) => application.job)),
    [myApplications],
  );

  const loadApplications = useCallback(
    async (authToken: string, currentUser: User) => {
      try {
        const mine = await apiRequest<Application[]>(
          "/applications/mine/",
          {},
          authToken,
        );
        setMyApplications(mine);

        if (currentUser.role === "owner" || currentUser.role === "admin") {
          const received = await apiRequest<Application[]>(
            "/applications/received/",
            {},
            authToken,
          );
          setReceivedApplications(received);
        } else {
          setReceivedApplications([]);
        }
      } catch {
        setMyApplications([]);
        setReceivedApplications([]);
      }
    },
    [],
  );

  const loadJobs = useCallback(async (activeFilters: Filters) => {
    setIsLoading(true);
    try {
      const query = buildJobQuery(activeFilters);
      const data = await apiRequest<Job[]>(`/jobs/?${query}`);
      setJobs(data);
      setFeedback({
        tone: "success",
        message: "Trabajos actualizados.",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los trabajos.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const session = readSession();

      if (!session) {
        router.replace("/");
        return;
      }

      setToken(session.token);
      setUser(session.user);
      void loadApplications(session.token, session.user);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadApplications, router]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [filters]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void loadJobs(debouncedFilters);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [debouncedFilters, loadJobs]);

  async function handleCreateJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    setIsWorking(true);

    try {
      await apiRequest<Job>(
        "/jobs/",
        {
          method: "POST",
          body: JSON.stringify({
            ...jobForm,
            payment: Number(jobForm.payment || 0).toFixed(2),
          }),
        },
        token,
      );
      setJobForm({
        title: "",
        type: "",
        location: "",
        payment: "",
        description: "",
      });
      setFeedback({ tone: "success", message: "Trabajo publicado." });
      await loadJobs(debouncedFilters);
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error ? error.message : "No se pudo publicar.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function handleApply(jobId: number) {
    if (!token || !user) return;
    setIsWorking(true);

    try {
      await apiRequest<Application>(
        "/applications/",
        {
          method: "POST",
          body: JSON.stringify({
            job: jobId,
            cover_letter: coverLetters[jobId] ?? "",
          }),
        },
        token,
      );
      setCoverLetters((current) => ({ ...current, [jobId]: "" }));
      setFeedback({ tone: "success", message: "Postulacion enviada." });
      await loadApplications(token, user);
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error ? error.message : "No se pudo postular.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  async function handleApplicationStatus(
    applicationId: number,
    status: "accept" | "reject",
  ) {
    if (!token || !user) return;
    setIsWorking(true);

    try {
      await apiRequest<Application>(
        `/applications/${applicationId}/${status}/`,
        { method: "PATCH" },
        token,
      );
      setFeedback({
        tone: "success",
        message:
          status === "accept"
            ? "Postulacion aceptada."
            : "Postulacion rechazada.",
      });
      await loadApplications(token, user);
      await loadJobs(debouncedFilters);
    } catch (error) {
      setFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "No se pudo actualizar la postulacion.",
      });
    } finally {
      setIsWorking(false);
    }
  }

  function handleLogout() {
    clearSession();
    router.replace("/");
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--app-bg)]">
        <div className="empty-state m-5">Preparando tu panel...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--app-bg)] text-[var(--ink)]">
      <header className="dashboard-header">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="brand-mark">STI</span>
            <span className="pill pill-blue">{roleLabels[user.role]}</span>
          </div>
          <h1>Panel de trabajo</h1>
          <p>Postulaciones, filtros y oportunidades conectadas al backend.</p>
        </div>
        <button className="btn btn-ghost" onClick={handleLogout} type="button">
          Salir
        </button>
      </header>

      <section className="dashboard-shell">
        <UserSidebar
          applications={myApplications}
          filters={filters}
          isLoading={isLoading}
          user={user}
          onFilterChange={setFilters}
          onRefresh={() => loadJobs(filters)}
          onSelectApplication={setSelectedApplication}
        />

        <div className="dashboard-content">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Estado</p>
              <h2>Panel activo</h2>
            </div>
            <span className={`status-message ${feedback.tone}`}>
              {feedback.message}
            </span>
          </div>

          {isOwner ? (
            <div className="owner-panel-slot">
              <CreateJobPanel
                form={jobForm}
                isWorking={isWorking}
                onChange={setJobForm}
                onSubmit={handleCreateJob}
              />
            </div>
          ) : null}

          <section className="space-y-5">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Oportunidades</p>
                <h2>Trabajos disponibles</h2>
              </div>
              <span className="status-message info">
                Busqueda con espera de 3 segundos
              </span>
            </div>

            {isLoading ? (
              <div className="empty-state">Cargando trabajos...</div>
            ) : jobs.length === 0 ? (
              <div className="empty-state">
                No hay trabajos con esos filtros.
              </div>
            ) : (
              <div className="grid gap-4 xl:grid-cols-2">
                {jobs.map((job) => (
                  <DashboardJobCard
                    applied={appliedJobIds.has(job.id)}
                    coverLetter={coverLetters[job.id] ?? ""}
                    isWorking={isWorking}
                    job={job}
                    key={job.id}
                    onApply={handleApply}
                    onCoverLetterChange={(value) =>
                      setCoverLetters((current) => ({
                        ...current,
                        [job.id]: value,
                      }))
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {isOwner ? (
            <ReceivedApplications
              applications={receivedApplications}
              isWorking={isWorking}
              onStatusChange={handleApplicationStatus}
            />
          ) : null}
        </div>
      </section>

      {selectedApplication ? (
        <ApplicationModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      ) : null}
    </main>
  );
}

function MissionVision() {
  return (
    <section className="mission-band">
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-5 py-8 md:grid-cols-2 md:px-8 lg:px-10">
        <article className="mission-card">
          <p className="eyebrow">Mision</p>
          <h2>Conectar trabajo local con confianza</h2>
          <p>
            Facilitar que personas y negocios encuentren apoyo informal de
            forma clara, rapida y organizada, manteniendo postulaciones y
            estados visibles desde una plataforma simple.
          </p>
        </article>
        <article className="mission-card mission-card-accent">
          <p className="eyebrow">Vision</p>
          <h2>Una red laboral cercana y verificable</h2>
          <p>
            Impulsar una comunidad donde publicar oportunidades, postular y
            gestionar decisiones sea accesible desde cualquier dispositivo,
            especialmente desde el telefono.
          </p>
        </article>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{value}</span>
      <small>{label}</small>
    </div>
  );
}

function AuthPanel({
  authForm,
  authMode,
  feedback,
  isWorking,
  onAuthFormChange,
  onAuthModeChange,
  onSubmit,
}: {
  authForm: { name: string; email: string; password: string; role: Role };
  authMode: "login" | "register";
  feedback: Feedback;
  isWorking: boolean;
  onAuthFormChange: (form: {
    name: string;
    email: string;
    password: string;
    role: Role;
  }) => void;
  onAuthModeChange: (mode: "login" | "register") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="panel auth-panel" onSubmit={onSubmit}>
      <div className="segmented">
        <button
          className={authMode === "login" ? "active" : ""}
          onClick={() => onAuthModeChange("login")}
          type="button"
        >
          Ingresar
        </button>
        <button
          className={authMode === "register" ? "active" : ""}
          onClick={() => onAuthModeChange("register")}
          type="button"
        >
          Registro
        </button>
      </div>

      {authMode === "register" ? (
        <label>
          Nombre
          <input
            onChange={(event) =>
              onAuthFormChange({ ...authForm, name: event.target.value })
            }
            required
            value={authForm.name}
          />
        </label>
      ) : null}

      <label>
        Email
        <input
          onChange={(event) =>
            onAuthFormChange({ ...authForm, email: event.target.value })
          }
          required
          type="email"
          value={authForm.email}
        />
      </label>

      <label>
        Contrasena
        <input
          minLength={8}
          onChange={(event) =>
            onAuthFormChange({ ...authForm, password: event.target.value })
          }
          required
          type="password"
          value={authForm.password}
        />
      </label>

      {authMode === "register" ? (
        <label>
          Rol
          <select
            onChange={(event) =>
              onAuthFormChange({
                ...authForm,
                role: event.target.value as Role,
              })
            }
            value={authForm.role}
          >
            <option value="worker">Trabajador</option>
            <option value="owner">Dueno</option>
          </select>
        </label>
      ) : null}

      <span className={`status-message ${feedback.tone}`}>
        {feedback.message}
      </span>

      <button className="btn btn-primary w-full" disabled={isWorking}>
        <span aria-hidden="true">{authMode === "login" ? ">" : "+"}</span>
        {isWorking ? "Procesando..." : "Continuar"}
      </button>
    </form>
  );
}

function UserSidebar({
  applications,
  filters,
  isLoading,
  user,
  onFilterChange,
  onRefresh,
  onSelectApplication,
}: {
  applications: Application[];
  filters: Filters;
  isLoading: boolean;
  user: User;
  onFilterChange: (filters: Filters) => void;
  onRefresh: () => void;
  onSelectApplication: (application: Application) => void;
}) {
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
        <FilterPanel
          embedded
          filters={filters}
          isLoading={isLoading}
          onChange={onFilterChange}
          onRefresh={onRefresh}
        />
      </div>
      <div>
        <p className="eyebrow mb-3">Lista</p>
        <div className="mini-list">
          {applications.length === 0 ? (
            <p className="muted">Sin postulaciones registradas.</p>
          ) : (
            applications.map((application) => (
              <button
                className="mini-row mini-row-button"
                key={application.id}
                onClick={() => onSelectApplication(application)}
                type="button"
              >
                <span>
                  {application.job_title ?? `Trabajo ${application.job}`}
                </span>
                <small>{statusLabels[application.status]}</small>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}

function ApplicationCards({
  applications,
  compact = false,
  onSelectApplication,
}: {
  applications: Application[];
  compact?: boolean;
  onSelectApplication: (application: Application) => void;
}) {
  if (applications.length === 0) {
    return (
      <div className="empty-state">
        Todavia no tienes postulaciones. Explora los trabajos disponibles.
      </div>
    );
  }

  return (
    <div className={compact ? "application-grid compact" : "application-grid"}>
      {applications.slice(0, 4).map((application) => (
        <button
          className="application-card"
          key={application.id}
          onClick={() => onSelectApplication(application)}
          type="button"
        >
          <span className={`status-chip ${application.status}`}>
            {statusLabels[application.status]}
          </span>
          <strong>{application.job_title ?? `Trabajo ${application.job}`}</strong>
          <small>{formatDate(application.created_at)}</small>
        </button>
      ))}
    </div>
  );
}

function FilterPanel({
  embedded = false,
  filters,
  isLoading,
  onChange,
  onRefresh,
}: {
  embedded?: boolean;
  filters: Filters;
  isLoading: boolean;
  onChange: (filters: Filters) => void;
  onRefresh: () => void;
}) {
  return (
    <div className={embedded ? "filter-panel-embedded" : "panel"}>
      <div className="panel-title">
        <div>
          <p className="eyebrow">Busqueda</p>
          <h2>Filtros</h2>
        </div>
        <button
          aria-label="Actualizar trabajos"
          className="icon-button"
          disabled={isLoading}
          onClick={onRefresh}
          title="Actualizar trabajos"
          type="button"
        >
          R
        </button>
      </div>

      <label>
        Texto
        <input
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          placeholder="Ej. pintura"
          value={filters.search}
        />
      </label>
      <label>
        Tipo
        <input
          onChange={(event) =>
            onChange({ ...filters, type: event.target.value })
          }
          placeholder="Limpieza, reparacion..."
          value={filters.type}
        />
      </label>
      <label>
        Ubicacion
        <input
          onChange={(event) =>
            onChange({ ...filters, location: event.target.value })
          }
          placeholder="Quito, Guayaquil..."
          value={filters.location}
        />
      </label>
      <label>
        Estado
        <select
          onChange={(event) =>
            onChange({ ...filters, status: event.target.value })
          }
          value={filters.status}
        >
          <option value="">Todos</option>
          <option value="open">Abiertos</option>
          <option value="assigned">Asignados</option>
          <option value="closed">Cerrados</option>
        </select>
      </label>
    </div>
  );
}

function CreateJobPanel({
  form,
  isWorking,
  onChange,
  onSubmit,
}: {
  form: {
    title: string;
    type: string;
    location: string;
    payment: string;
    description: string;
  };
  isWorking: boolean;
  onChange: (form: {
    title: string;
    type: string;
    location: string;
    payment: string;
    description: string;
  }) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form className="panel" onSubmit={onSubmit}>
      <div>
        <p className="eyebrow">Duenos</p>
        <h2>Publicar trabajo</h2>
      </div>
      <label>
        Titulo
        <input
          onChange={(event) => onChange({ ...form, title: event.target.value })}
          required
          value={form.title}
        />
      </label>
      <label>
        Tipo
        <input
          onChange={(event) => onChange({ ...form, type: event.target.value })}
          required
          value={form.type}
        />
      </label>
      <label>
        Ubicacion
        <input
          onChange={(event) =>
            onChange({ ...form, location: event.target.value })
          }
          required
          value={form.location}
        />
      </label>
      <label>
        Pago
        <input
          min="0"
          onChange={(event) =>
            onChange({ ...form, payment: event.target.value })
          }
          required
          step="0.01"
          type="number"
          value={form.payment}
        />
      </label>
      <label>
        Descripcion
        <textarea
          onChange={(event) =>
            onChange({ ...form, description: event.target.value })
          }
          required
          rows={4}
          value={form.description}
        />
      </label>
      <button className="btn btn-accent w-full" disabled={isWorking}>
        <span aria-hidden="true">+</span>
        Publicar
      </button>
    </form>
  );
}

function DashboardJobCard({
  applied,
  coverLetter,
  isWorking,
  job,
  onApply,
  onCoverLetterChange,
}: {
  applied: boolean;
  coverLetter: string;
  isWorking: boolean;
  job: Job;
  onApply: (jobId: number) => void;
  onCoverLetterChange: (value: string) => void;
}) {
  return (
    <article className="job-card apply-hover-card">
      <div className="hover-callout">Postula ya!</div>
      <div className="job-card-top">
        <div>
          <p className="eyebrow">{job.type}</p>
          <h3>{job.title}</h3>
        </div>
        <span className={`status-chip ${job.status}`}>
          {statusLabels[job.status]}
        </span>
      </div>
      <p className="job-description">{job.description}</p>
      <div className="job-meta">
        <span>{job.location}</span>
        <span>{formatMoney(job.payment)}</span>
        <span>{formatDate(job.created_at)}</span>
      </div>
      <div className="creator-row">
        <span className="avatar">
          {(job.creator_name || "ST").slice(0, 2).toUpperCase()}
        </span>
        <span>{job.creator_name || "Publicador"}</span>
      </div>
      <textarea
        onChange={(event) => onCoverLetterChange(event.target.value)}
        placeholder="Mensaje de postulacion"
        rows={3}
        value={coverLetter}
      />
      <button
        className={applied ? "btn btn-soft w-full" : "btn btn-primary w-full"}
        disabled={isWorking || applied || job.status !== "open"}
        onClick={() => onApply(job.id)}
        type="button"
      >
        <span aria-hidden="true">{applied ? "OK" : ">"}</span>
        {applied ? "Postulado" : "Postularme"}
      </button>
    </article>
  );
}

function ReceivedApplications({
  applications,
  isWorking,
  onStatusChange,
}: {
  applications: Application[];
  isWorking: boolean;
  onStatusChange: (applicationId: number, status: "accept" | "reject") => void;
}) {
  return (
    <section className="panel">
      <div>
        <p className="eyebrow">Gestion</p>
        <h2>Postulaciones recibidas</h2>
      </div>

      {applications.length === 0 ? (
        <p className="muted">Todavia no hay postulantes.</p>
      ) : (
        <div className="received-list">
          {applications.map((application) => (
            <article className="received-row" key={application.id}>
              <div>
                <strong>{application.applicant_name ?? "Postulante"}</strong>
                <span>{application.job_title}</span>
                {application.cover_letter ? (
                  <p>{application.cover_letter}</p>
                ) : null}
              </div>
              <div className="received-actions">
                <span className={`status-chip ${application.status}`}>
                  {statusLabels[application.status]}
                </span>
                <button
                  aria-label="Aceptar postulacion"
                  className="icon-button accept"
                  disabled={isWorking || application.status !== "pending"}
                  onClick={() => onStatusChange(application.id, "accept")}
                  title="Aceptar"
                  type="button"
                >
                  OK
                </button>
                <button
                  aria-label="Rechazar postulacion"
                  className="icon-button reject"
                  disabled={isWorking || application.status !== "pending"}
                  onClick={() => onStatusChange(application.id, "reject")}
                  title="Rechazar"
                  type="button"
                >
                  X
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ApplicationModal({
  application,
  onClose,
}: {
  application: Application;
  onClose: () => void;
}) {
  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <article
        aria-modal="true"
        className="floating-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="panel-title">
          <div>
            <p className="eyebrow">Detalle</p>
            <h2>{application.job_title ?? `Trabajo ${application.job}`}</h2>
          </div>
          <button
            aria-label="Cerrar detalle"
            className="icon-button"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>
        <div className="detail-grid">
          <span>Estado</span>
          <strong>{statusLabels[application.status]}</strong>
          <span>Fecha</span>
          <strong>{formatDate(application.created_at)}</strong>
          <span>ID trabajo</span>
          <strong>{application.job}</strong>
        </div>
        <div>
          <p className="eyebrow">Mensaje enviado</p>
          <p className="job-description">
            {application.cover_letter || "Sin mensaje de postulacion."}
          </p>
        </div>
      </article>
    </div>
  );
}
